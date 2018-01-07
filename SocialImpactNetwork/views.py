import json

from django.core.mail import send_mail
from django.db.models import Q
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import loader
from django.template.loader import get_template
from django.views.generic import View
from django.shortcuts import render

from rest_framework import views

from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response

from ProblemSolverCentral.settings import EMAIL_HOST_USER
from SocialImpactNetwork.serializers import (ProjectSerializer, ResourceTypeSerializer, ContactQuestionAnswerSerializer,
                                             ChatSerializer, CountrySerializer, CitySerializer, SkillSerializer,
                                             LoungeAreaSerializer, LoungeAreaMemberSerializer)
from SocialImpactNetwork.serializers import ContactQuestionSerializer, ContactSerializer, NetworkSerializer
from SocialImpactNetwork.serializers import AffiliationSerializer, FieldOfWorkSerializer, CategorySerializer
from SocialImpactNetwork.models import (ResourceType, Resource, Project, Contact, Network, Affiliations,
                                        Category, ContactQuestionAnswer, Chat, Skill, LoungeArea, LoungeAreaMember)
from SocialImpactNetwork.models import FieldsOfWork, ContactQuestions
from cities_light.models import Country, City

from authentication.models import SocialUser
from authentication.serializers import SocialUserSerializer


class Index(View):
    """
    This class is a view for index page of application
    """

    def get(self, request):
        """
        This method handles the request for the index page

        :param request: request for the index page
        :return: returns the index.html page in response
        :param request:
        :return: returns index.html page
        """
        template = loader.get_template('base_.html')
        if request.user.is_active:
            context = {
                'full_name': request.user.first_name
            }
        else:
            context = {
                'full_name': ""
            }
        return HttpResponse(template.render(context, request))


class SocialNetworkSearch(View):
    """
    this view handles request for the social_search.html page
    """

    def get(self, request):
        """
            this page defines the view for social network search page
            :param request:
            :return:
            """
        template = loader.get_template('social_search.html')
        context = {

        }
        return HttpResponse(template.render(context, request))


class LoungeAreaViewSet(viewsets.ModelViewSet):
    queryset = LoungeArea.objects.all()
    serializer_class = LoungeAreaSerializer

    def create(self, request, *args, **kwargs):
        request.data['created_by'] = request.user.id
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            lounge_area = serializer.save(created_by=request.user)
            request.data['emails'].append({'email': str(request.user.email), 'status': 'Joined'})
            for member in request.data['emails']:
                member_serializer = LoungeAreaMemberSerializer(data=member)
                if member_serializer.is_valid():
                    if LoungeAreaMember.objects.filter(lounge_area__id=lounge_area.id,
                                                       email=member['email']).count() == 0:
                        member_serializer.save(lounge_area=lounge_area)
                    if SocialUser.objects.filter(email=member['email']).count() == 0:
                        send_email_to_lounge_area_members(lounge_area, member['email'])

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'Bad request',
            'message': 'Lounge Area could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        if self.queryset.filter(id=request.data).count() != 0:
            instance = self.queryset.get(id=request.data)
            if LoungeAreaMember.objects.filter(lounge_area=instance,
                                               email=str(request.user.email)).count() == 0 and instance.is_restricted:
                return Response({
                    'status': 'Bad request',
                    'message': 'Solutions Hub Not Found'
                }, status=status.HTTP_404_NOT_FOUND)
            serializer = self.serializer_class(instance)
            return Response(serializer.data)
        return Response({
            'status': 'Bad request',
            'message': 'Solutions Hub Not Found'
        }, status=status.HTTP_404_NOT_FOUND)


def send_email_to_lounge_area_members(lounge_area, email_address):
    template = get_template('lounge_area_join_request_email.html')
    content = template.render({
        'lounge_area_name': lounge_area.name,
        'lounge_area_description': lounge_area.description
    })
    send_mail(
        'Request to join Lounge Area %s' % lounge_area.name,
        'Lounge Area Request',
        EMAIL_HOST_USER,
        [email_address],
        fail_silently=False,
        html_message=content
    )


class LoungeAreaMemberViewSet(viewsets.ModelViewSet):
    queryset = LoungeAreaMember
    serializer_class = LoungeAreaMemberSerializer

    def create(self, request, *args, **kwargs):
        lounge_area = LoungeArea.objects.get(id=request.data['loungeAreaId'])
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            if LoungeAreaMember.objects.filter(lounge_area__id=request.data['loungeAreaId'],
                                               email=request.data['email']).count() == 0:
                send_email_to_lounge_area_members(lounge_area, request.data['email'])
                serializer.save(lounge_area=lounge_area)
                return Response(serializer.data)
            return Response("member already exists")
        return Response({
            'status': 'Bad request',
            'message': 'Lounge Area Member could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        member = self.queryset.objects.get(id=request.data['requestId'])
        if serializer.is_valid():
            serializer.update(member, serializer.validated_data)
            return Response(serializer.validated_data)

    def list(self, request, *args, **kwargs):
        if request.data['loungeAreaId']:
            lounge_area_request_objects = LoungeAreaMember.objects.filter(lounge_area__id=request.data['loungeAreaId'])
            member_objects = []
            for member in lounge_area_request_objects:
                try:
                    if member.status == 'Joined':
                        member_objects.append(SocialUser.objects.get(email=member.email))
                except SocialUser.DoesNotExist:
                    pass
            members = SocialUserSerializer(member_objects, many=True)
        else:
            lounge_area_request_objects = LoungeAreaMember.objects.filter(email=str(request.user.email))
            members = self.serializer_class(lounge_area_request_objects, many=True)
        return Response(members.data)

    def retrieve(self, request, *args, **kwargs):
        lounge_area_request_object = LoungeAreaMember.objects.get(lounge_area__id=request.data['loungeAreaId'],
                                                                  email=request.data['email'])
        lounge_area_request = self.serializer_class(lounge_area_request_object, many=False)
        return Response(lounge_area_request.data)


class PledgeContact(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def retrieve(self, request, *args, **kwargs):
        if request.data['projectId']:
            serializer = self.serializer_class(self.queryset.get(project=request.data['projectId']))
        elif request.data['networkId']:
            serializer = self.serializer_class(self.queryset.get(network=request.data['networkId']))
        elif request.data['skillId']:
            serializer = self.serializer_class(self.queryset.get(skill=request.data['skillId']))

        return Response(serializer.data)


class PledgeProject(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        categories_id_list = [category['id'] for category in json.loads(request.data['categories_selected'])]
        categories = Category.objects.filter(id__in=categories_id_list)

        if serializer.is_valid():
            project_resource_type = ResourceType.objects.get(resource_type=request.data['resource_type'])
            project_resources = Resource.objects.filter(resource_category__in=categories,
                                                        resource_user=request.user,
                                                        resource_type=project_resource_type)
            flag = False
            project_resource = {}
            for resource in project_resources:
                for category in categories:
                    if category in resource.resource_category.all():
                        flag = True
                    else:
                        flag = False
                        break
                if flag:
                    project_resource = resource
                    break

            if not project_resource:
                project_resource = Resource(resource_user=request.user, resource_type=project_resource_type,
                                            geographical_area=request.user.geographical_area.lower())
                project_resource.save()
                for category in categories:
                    project_resource.resource_category.add(category)

            project = serializer.save(resource=project_resource)
            project_serializer = serializer
            if not json.loads(request.data['worldwide']):
                countries_id_list = [country['id'] for country in json.loads(request.data['country_model'])]
                countries = Country.objects.filter(id__in=countries_id_list)
                for country in countries:
                    project.geographical_countries.add(country)

                if not json.loads(request.data['citywide']):
                    cities_id_list = [city['id'] for city in json.loads(request.data['city_model'])]
                    cities = City.objects.filter(id__in=cities_id_list)
                    for city in cities:
                        project.geographical_cities.add(city)

            questions = json.loads(request.data['questions'])
            for question in questions:
                serialized_questions = ContactQuestionSerializer(
                    data={'question': question})
                if serialized_questions.is_valid():
                    serialized_questions.save(project=project)

                    # contact
            serializer = ContactSerializer(data=request.data)
            if serializer.is_valid():
                contact = serializer.save(project=project)
                if len(request.FILES) != 0:
                    contact.image = request.FILES['file']
                    contact.save()

                orgnaizations = json.loads(request.data['orgnaizations'])
                for organization in orgnaizations:
                    serialized_affiliation = AffiliationSerializer(data={'organization': organization})
                    if serialized_affiliation.is_valid():
                        serialized_affiliation.save(contact=contact)
                        # contact
            return Response(project_serializer.data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Project could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        serializer = ProjectSerializer(data=request.data)
        project = Project.objects.get(id=request.data['projectId'])
        if serializer.is_valid():
            serializer.update(project, serializer.validated_data)
            contact_questions = ContactQuestions.objects.filter(project=project)
            questions = request.data['questions']
            for contact_question in contact_questions:
                flag = True
                for question in questions:
                    if contact_question.id == question['id']:
                        flag = False

                if flag:
                    contact_question.delete()

            contact_question_serializer = ContactQuestionSerializer
            for question in questions:
                if type(question['id']) == int:
                    question_object = ContactQuestions.objects.get(id=question['id'])
                    question['question'] = question['name']
                    contact_question = contact_question_serializer(data=question)
                    contact_question.update(question_object, question)
                else:
                    serialized_questions = ContactQuestionSerializer(
                        data={'question': question['name']})
                    if serialized_questions.is_valid():
                        serialized_questions.save(project=project)

            project.geographical_cities.clear()
            project.geographical_countries.clear()
            if not json.loads(request.data['worldwide']):
                countries_id_list = [country['id'] for country in json.loads(request.data['country_model'])]
                countries = Country.objects.filter(id__in=countries_id_list)
                for country in countries:
                    project.geographical_countries.add(country)

                if not json.loads(request.data['citywide']):
                    cities_id_list = [city['id'] for city in json.loads(request.data['city_model'])]
                    cities = City.objects.filter(id__in=cities_id_list)
                    for city in cities:
                        project.geographical_cities.add(city)

            project_serializer = serializer
            serializer = ContactSerializer(data=request.data)
            contact = Contact.objects.get(id=request.data['contactId'])
            if serializer.is_valid():
                serializer.update(contact, serializer.validated_data)
                affiliation_objects = Affiliations.objects.filter(contact=contact)

                orgnaizations = request.data['orgnaizations']
                for affiliation_object in affiliation_objects:
                    flag = True
                    for orgnaization in orgnaizations:
                        if affiliation_object.id == orgnaization['id']:
                            flag = False

                    if flag:
                        affiliation_object.delete()
                affiliation_serializer = AffiliationSerializer
                if orgnaizations:
                    for organization in orgnaizations:
                        if type(organization['id']) == int:
                            affiliation = Affiliations.objects.get(id=organization['id'])
                            organization['organization'] = organization['name']
                            contact_question = affiliation_serializer(data=organization)
                            contact_question.update(affiliation, organization)
                        else:
                            serialized_affiliation = AffiliationSerializer(data={'organization': organization['name']})
                            if serialized_affiliation.is_valid():
                                serialized_affiliation.save(contact=contact)

            return Response(project_serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Project could not be updated with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        project = Project.objects.get(id=request.data['projectId'])
        ContactQuestions.objects.filter(project=project).delete()
        project.delete()
        return Response({
            'status': 'deleted request',
            'message': 'Project deleted received data.'
        }, status=status.HTTP_202_ACCEPTED)

    def list(self, request, *args, **kwargs):
        projects = self.queryset.filter(resource__resource_user__id=request.user.id)
        serializer = self.serializer_class(projects, many=True)
        return Response(serializer.data)


class PledgeNetwork(viewsets.ModelViewSet):
    queryset = Network.objects.all()
    serializer_class = NetworkSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        categories_id_list = [category['id'] for category in json.loads(request.data['categories_selected'])]
        categories = Category.objects.filter(id__in=categories_id_list)

        if serializer.is_valid():
            network_resource_type = ResourceType.objects.get(resource_type=request.data['resource_type'])
            network_resources = Resource.objects.filter(resource_category__in=categories,
                                                        resource_user=request.user,
                                                        resource_type=network_resource_type)
            flag = False
            network_resource = {}
            for resource in network_resources:
                for category in categories:
                    if category in resource.resource_category.all():
                        flag = True
                    else:
                        flag = False
                        break
                if flag:
                    network_resource = resource
                    break

            if not network_resource:
                network_resource = Resource(resource_user=request.user, resource_type=network_resource_type,
                                            geographical_area=request.user.geographical_area.lower())
                network_resource.save()
                for category in categories:
                    network_resource.resource_category.add(category)

            network = serializer.save(resource=network_resource)
            network_serializer = serializer

            if not json.loads(request.data['worldwide']):
                countries_id_list = [country['id'] for country in json.loads(request.data['country_model'])]
                countries = Country.objects.filter(id__in=countries_id_list)
                for country in countries:
                    network.geographical_countries.add(country)

                if not json.loads(request.data['citywide']):
                    cities_id_list = [city['id'] for city in json.loads(request.data['city_model'])]
                    cities = City.objects.filter(id__in=cities_id_list)
                    for city in cities:
                        network.geographical_cities.add(city)

            serializer = ContactSerializer(data=request.data)
            if serializer.is_valid():
                contact = serializer.save(network=network)
                if len(request.FILES) != 0:
                    contact.image = request.FILES['file']
                    contact.save()

                orgnaizations = json.loads(request.data['orgnaizations'])
                for organization in orgnaizations:
                    serialized_affiliation = AffiliationSerializer(data={'organization': organization})
                    if serialized_affiliation.is_valid():
                        serialized_affiliation.save(contact=contact)

            return Response(network_serializer.data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Network could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        serializer = NetworkSerializer(data=request.data)
        network = Network.objects.get(id=request.data['networkId'])
        if serializer.is_valid():
            serializer.update(network, serializer.validated_data)

            network.geographical_cities.clear()
            network.geographical_countries.clear()
            if not json.loads(request.data['worldwide']):
                countries_id_list = [country['id'] for country in json.loads(request.data['country_model'])]
                countries = Country.objects.filter(id__in=countries_id_list)
                for country in countries:
                    network.geographical_countries.add(country)

                if not json.loads(request.data['citywide']):
                    cities_id_list = [city['id'] for city in json.loads(request.data['city_model'])]
                    cities = City.objects.filter(id__in=cities_id_list)
                    for city in cities:
                        network.geographical_cities.add(city)

            network_serializer = serializer
            serializer = ContactSerializer(data=request.data)
            contact = Contact.objects.get(id=request.data['contactId'])
            if serializer.is_valid():
                serializer.update(contact, serializer.validated_data)
                affiliation_objects = Affiliations.objects.filter(contact=contact)

                orgnaizations = request.data['orgnaizations']
                for affiliation_object in affiliation_objects:
                    flag = True
                    for orgnaization in orgnaizations:
                        if affiliation_object.id == orgnaization['id']:
                            flag = False

                    if flag:
                        affiliation_object.delete()
                affiliation_serializer = AffiliationSerializer
                if orgnaizations:
                    for organization in orgnaizations:
                        if type(organization['id']) == int:
                            affiliation = Affiliations.objects.get(id=organization['id'])
                            organization['organization'] = organization['name']
                            contact_question = affiliation_serializer(data=organization)
                            contact_question.update(affiliation, organization)
                        else:
                            serialized_affiliation = AffiliationSerializer(data={'organization': organization['name']})
                            if serialized_affiliation.is_valid():
                                serialized_affiliation.save(contact=contact)

            return Response(network_serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Network could not be updated with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        network = Network.objects.get(id=request.data['networkId'])
        FieldsOfWork.objects.filter(network=network).delete()
        network.delete()
        return Response({
            'status': 'deleted request',
            'message': 'Network deleted received data.'
        }, status=status.HTTP_202_ACCEPTED)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        serialized_data = serializer.data
        return Response(serialized_data)

    def list(self, request, *args, **kwargs):
        networks = self.queryset.filter(resource__resource_user__id=request.user.id)
        serializer = self.serializer_class(networks, many=True)
        return Response(serializer.data)


class PledgeSkill(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

    def create(self, request, *args, **kwargs):
        request.data['skill_user'] = request.user.id
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            skill = serializer.save(skill_user=request.user)
            skill_serializer = serializer

            if not json.loads(request.data['worldwide']):
                countries_id_list = [country['id'] for country in json.loads(request.data['country_model'])]
                countries = Country.objects.filter(id__in=countries_id_list)
                for country in countries:
                    skill.geographical_countries.add(country)

                if not json.loads(request.data['citywide']):
                    cities_id_list = [city['id'] for city in json.loads(request.data['city_model'])]
                    cities = City.objects.filter(id__in=cities_id_list)
                    for city in cities:
                        skill.geographical_cities.add(city)

            serializer = ContactSerializer(data=request.data)
            if serializer.is_valid():
                contact = serializer.save(skill=skill)
                if len(request.FILES) != 0:
                    contact.image = request.FILES['file']
                    contact.save()

                orgnaizations = json.loads(request.data['orgnaizations'])
                for organization in orgnaizations:
                    serialized_affiliation = AffiliationSerializer(data={'organization': organization})
                    if serialized_affiliation.is_valid():
                        serialized_affiliation.save(contact=contact)

            return Response(skill_serializer.data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Network could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        request.data['skill_user'] = request.user.id
        serializer = SkillSerializer(data=request.data)
        skill = Skill.objects.get(id=request.data['skillId'])
        if serializer.is_valid():
            serializer.update(skill, serializer.validated_data)

            skill.geographical_cities.clear()
            skill.geographical_countries.clear()
            if not json.loads(request.data['worldwide']):
                countries_id_list = [country['id'] for country in json.loads(request.data['country_model'])]
                countries = Country.objects.filter(id__in=countries_id_list)
                for country in countries:
                    skill.geographical_countries.add(country)

                if not json.loads(request.data['citywide']):
                    cities_id_list = [city['id'] for city in json.loads(request.data['city_model'])]
                    cities = City.objects.filter(id__in=cities_id_list)
                    for city in cities:
                        skill.geographical_cities.add(city)

            skill_serializer = serializer
            serializer = ContactSerializer(data=request.data)
            contact = Contact.objects.get(id=request.data['contactId'])
            if serializer.is_valid():
                serializer.update(contact, serializer.validated_data)
                affiliation_objects = Affiliations.objects.filter(contact=contact)

                orgnaizations = request.data['orgnaizations']
                for affiliation_object in affiliation_objects:
                    flag = True
                    for orgnaization in orgnaizations:
                        if affiliation_object.id == orgnaization['id']:
                            flag = False

                    if flag:
                        affiliation_object.delete()
                affiliation_serializer = AffiliationSerializer
                if orgnaizations:
                    for organization in orgnaizations:
                        if type(organization['id']) == int:
                            affiliation = Affiliations.objects.get(id=organization['id'])
                            organization['organization'] = organization['name']
                            contact_question = affiliation_serializer(data=organization)
                            contact_question.update(affiliation, organization)
                        else:
                            serialized_affiliation = AffiliationSerializer(data={'organization': organization['name']})
                            if serialized_affiliation.is_valid():
                                serialized_affiliation.save(contact=contact)

            return HttpResponse(skill_serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Skill could not be updated with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        skill = Skill.objects.get(id=request.data['skillId'])
        skill.delete()
        return Response({
            'status': 'deleted request',
            'message': 'Skill deleted received data.'
        }, status=status.HTTP_202_ACCEPTED)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        serialized_data = serializer.data
        user = SocialUser.objects.get(id=serializer.data['skill_user'])
        serialized_user = SocialUserSerializer(user)
        return Response({'skill': serialized_data, 'user': serialized_user.data})

    def list(self, request, *args, **kwargs):
        skills = self.queryset.filter(skill_user__id=request.user.id)
        serializer = self.serializer_class(skills, many=True)
        return Response(serializer.data)


class AllCategoriesViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class AllResourceTypesViewSet(viewsets.ModelViewSet):
    queryset = ResourceType.objects.all()
    serializer_class = ResourceTypeSerializer


# returns the categories of the resources that current user owns
class AllUserCategoriesViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        user_resources = Resource.objects.filter(
            resource_user=self.request.user).values_list('resource_category', flat=True)
        return self.queryset.filter(pk__in=user_resources)


class AllUserProjectsViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        if json.loads(self.request.GET['category']).get('id') == 0:
            data = list(self.queryset.filter(resource__resource_user=self.request.user))
        else:
            data = list(self.queryset.filter(resource__resource_user=self.request.user).filter(
                resource__resource_category=json.loads(self.request.GET['category']).get('id')))
        data = data[::-1]
        return data


class AllUserNetworksViewSet(viewsets.ModelViewSet):
    """
        Define the periodic tasks
    """
    queryset = Network.objects.all()
    serializer_class = NetworkSerializer

    def get_queryset(self):
        if json.loads(self.request.GET['category']).get('id') == 0:
            data = list(self.queryset.filter(resource__resource_user=self.request.user))
        else:
            data = list(self.queryset.filter(resource__resource_user=self.request.user).filter(
                resource__resource_category=json.loads(self.request.GET['category']).get('id')))
        data = data[::-1]
        return data


class AffiliationsViewSet(viewsets.ModelViewSet):
    queryset = Affiliations.objects.all()
    serializer_class = AffiliationSerializer


def get_affiliations(request, contact_id):
    contact = Contact.objects.get(pk=contact_id)
    affiliations = None
    if contact.affiliations_set.all().count() != 0:
        affiliations = contact.affiliations_set.all()
        affiliation_list = []
        for affiliation in affiliations:
            affiliation_list.append({'affiliation': affiliation.organization,
                                     'id': affiliation.id})

    return HttpResponse(json.dumps(affiliation_list))


class SocialNetworkSearchAPI(views.APIView):
    def post(self, request):
        categories_selected = json.loads(request.data.get('category'))
        search_text = request.data.get('searchText')
        geographical_countries_ids = []
        geographical_cities_ids = []
        for country in json.loads(request.data.get('country_model')):
            geographical_countries_ids.append(country['id'])

        for city in json.loads(request.data.get('city_model')):
            geographical_cities_ids.append(city['id'])

        if not categories_selected:
            projects = Project.objects.filter(
                project_name__icontains=search_text)
            networks = Network.objects.filter(
                network_name__icontains=search_text)
            skills = Skill.objects.filter(
                skill_name__icontains=search_text
            )
            if geographical_countries_ids:
                projects = projects.filter(
                    Q(geographical_countries__in=geographical_countries_ids) | Q(geographical_countries__isnull=True))
                networks = networks.filter(
                    Q(geographical_countries__in=geographical_countries_ids) | Q(geographical_countries__isnull=True))
                skills = skills.filter(
                    Q(geographical_countries__in=geographical_countries_ids) | Q(geographical_countries__isnull=True))
                if geographical_cities_ids:
                    projects = projects.filter(
                        Q(geographical_cities__in=geographical_cities_ids) | Q(geographical_cities__isnull=True))
                    networks = networks.filter(
                        Q(geographical_cities__in=geographical_cities_ids) | Q(geographical_cities__isnull=True))
                    skills = skills.filter(
                        Q(geographical_cities__in=geographical_cities_ids) | Q(geographical_cities__isnull=True))

            projects_data = ProjectSerializer(projects, many=True)
            networks_data = NetworkSerializer(networks, many=True)
            skills_data = SkillSerializer(skills, many=True)

            projects = [i for n, i in enumerate(projects_data.data) if i not in projects_data.data[n + 1:]]
            networks = [i for n, i in enumerate(networks_data.data) if i not in networks_data.data[n + 1:]]
            skills = [i for n, i in enumerate(skills_data.data) if i not in skills_data.data[n + 1:]]

            return Response({
                'projects': projects,
                'networks': networks,
                'skills': skills
            })
        else:
            categories = []
            for category in categories_selected:
                categories.append(Category.objects.get(category_name=category['category_name']))

            projects = Project.objects.filter(
                project_name__icontains=search_text,
                resource__resource_category__in=categories)
            networks = Network.objects.filter(
                network_name__icontains=search_text,
                resource__resource_category__in=categories)
            skills = Skill.objects.filter(
                skill_name__icontains=search_text
            )
            if geographical_countries_ids:
                projects = projects.filter(
                    Q(geographical_countries__in=geographical_countries_ids) | Q(geographical_countries__isnull=True))
                networks = networks.filter(
                    Q(geographical_countries__in=geographical_countries_ids) | Q(geographical_countries__isnull=True))
                skills = skills.filter(
                    Q(geographical_countries__in=geographical_countries_ids) | Q(geographical_countries__isnull=True))
                if geographical_cities_ids:
                    projects = projects.filter(
                        Q(geographical_cities__in=geographical_cities_ids) | Q(geographical_cities__isnull=True))
                    networks = networks.filter(
                        Q(geographical_cities__in=geographical_cities_ids) | Q(geographical_cities__isnull=True))
                    skills = skills.filter(
                        Q(geographical_cities__in=geographical_cities_ids) | Q(geographical_cities__isnull=True))

            projects_data = ProjectSerializer(projects, many=True)
            networks_data = NetworkSerializer(networks, many=True)
            skills_data = SkillSerializer(skills, many=True)

            projects = [i for n, i in enumerate(projects_data.data) if i not in projects_data.data[n + 1:]]
            networks = [i for n, i in enumerate(networks_data.data) if i not in networks_data.data[n + 1:]]
            skills = [i for n, i in enumerate(skills_data.data) if i not in skills_data.data[n + 1:]]
            return Response({
                'projects': projects,
                'networks': networks,
                'skills': skills
            })

    def get(self, request):
        project_objects = Project.objects.all()
        network_objects = Network.objects.all()
        skill_objects = Skill.objects.all()
        projects = ProjectSerializer(project_objects, many=True)
        networks = NetworkSerializer(network_objects, many=True)
        skills = SkillSerializer(skill_objects, many=True)
        return Response({
            'projects': projects.data,
            'networks': networks.data,
            'skills': skills.data
        })


class ProjectsViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        contact_serializer = ContactQuestionSerializer(instance.contactquestions_set.all(), many=True)
        questions = [(data['id'], data['question']) for data in contact_serializer.data]
        serialized_data = serializer.data
        serialized_data.update(dict(questions=questions))
        return Response(serialized_data)


class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data={'message': request.data['message']})
        if serializer.is_valid():
            if request.data['projectId']:
                project = Project.objects.get(id=request.data['projectId'])
                serializer.save(project=project, sent_by=request.user)
            if request.data['loungeAreaId']:
                lounge_area = LoungeArea.objects.get(id=request.data['loungeAreaId'])
                serializer.save(lounge_area=lounge_area, sent_by=request.user)
            return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        chat = []
        if request.data['projectId']:
            project = Project.objects.get(id=request.data['projectId'])
            chat = Chat.objects.filter(project=project)
        if request.data['loungeAreaId']:
            lounge_area = LoungeArea.objects.get(id=request.data['loungeAreaId'])
            chat = Chat.objects.filter(lounge_area=lounge_area).order_by('sent_time')

        serializer = ChatSerializer(chat, many=True)
        return Response(serializer.data)


class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer

    def get_queryset(self):
        return self.queryset

    def list(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.queryset.filter(id__in=request.data), many=True)
        if not request.data:
            serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data)


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer

    def get_queryset(self):
        return self.queryset.filter(country=self.request.GET['country_id']).distinct('name')

    def list(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.queryset.filter(id__in=request.data), many=True)
        if request.GET:
            serializer = self.serializer_class(
                self.queryset.filter(country=self.request.GET['country_id']).distinct('name')
                , many=True)
        return Response(serializer.data)


class ContactQuestionAnswerViewSet(viewsets.ModelViewSet):
    queryset = ContactQuestionAnswer.objects.all()
    serializer_class = ContactQuestionAnswerSerializer

    def retrieve(self, request, *args, **kwargs):
        # instance = self.get_object()
        project_id = kwargs.get('pk')

        if not request.query_params.get('userId'):
            queryset = self.queryset.filter(question__project__pk=project_id,
                                            user__pk=request.user.id)
        else:
            user_id = request.query_params.get('userId')
            queryset = self.queryset.filter(question__project__pk=project_id,
                                            user__pk=user_id)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        if self.request.user.is_admin:
            distinct_rows = self.queryset.filter(
                question__project__resource__resource_user__moderation=True
            ).values('pk', 'question__project', 'user').distinct('question__project', 'user')
        else:
            distinct_rows = self.queryset.filter(
                question__project__resource__resource_user=self.request.user
            ).values('pk', 'question__project', 'user').distinct('question__project', 'user')
        row_ids = [row['pk'] for row in distinct_rows]
        self.queryset = self.queryset.filter(pk__in=row_ids)
        return super(ContactQuestionAnswerViewSet, self).list(request, *args, **kwargs)


def submit_contact_form(request):
    form_data = request.body
    json_data = json.loads(form_data.decode('UTF-8'))
    project = Project.objects.get(pk=json_data.pop('projectId'))
    is_moderate_request = json_data.pop('moderate', None)
    user_submitted = json_data.pop('submittingUser', None)
    status = json_data.pop('status', None)
    questions_answered = []
    contact_questions = project.contactquestions_set.filter(pk__in=json_data.keys())
    for contact_question in contact_questions:

        questions_answered.append({
            'question': contact_question.question,
            'answer': json_data[unicode(contact_question.pk)]
        })
        if not is_moderate_request and not request.user.is_admin:
            if ContactQuestionAnswer.objects.filter(question=contact_question, user=request.user).count() > 0:
                ContactQuestionAnswer.objects.filter(question=contact_question, user=request.user).delete()

            ContactQuestionAnswer.objects.create(
                question=contact_question, answer=json_data[unicode(contact_question.pk)]['answer'],
                user=request.user
            )
        else:
            contact_response = ContactQuestionAnswer.objects.get(
                question=contact_question, user__pk=user_submitted
            )
            contact_response.answer = json_data[unicode(contact_question.pk)]
            contact_response.status = status
            contact_response.save()

    template = get_template('project_contact_form_email.html')
    content = template.render({
        'project_name': project.project_name,
        'questions': questions_answered
    })

    is_admin_user = request.user.is_admin
    has_moderation_on = contact_questions[0].project.resource.resource_user.moderation

    if (is_moderate_request and has_moderation_on and is_admin_user and status == 'Approved'
        or (not has_moderation_on and not is_admin_user)):
        send_mail(
            'Contact answers for %s' % project.project_name,
            'Contact Form',
            EMAIL_HOST_USER,
            [project.resource.resource_user.email],
            fail_silently=False,
            html_message=content
        )
        return HttpResponse(json.dumps({
            'message': 'Email Successfully Sent'
        }))
    return HttpResponse(json.dumps({
        'message': 'Response Saved'
    }))


class ContactQuestionViewSet(viewsets.ModelViewSet):
    queryset = ContactQuestions
    serializer_class = ContactQuestionSerializer

    def list(self, request, *args, **kwargs):
        resource = Resource.objects.filter(resource_user__id=request.user.id).first()
        project = Project.objects.filter(resource=resource).first()
        questions = self.queryset.objects.filter(project=project)
        serializer = self.serializer_class(questions, many=True)
        return Response(serializer.data)
