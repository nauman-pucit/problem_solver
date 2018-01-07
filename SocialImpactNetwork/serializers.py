from rest_framework.serializers import ModelSerializer

from cities_light.models import Country, City
from SocialImpactNetwork.models import (SocialUser, ResourceType, Resource, Project, Contact, Network, Affiliations,
                                        Category, ContactQuestionAnswer, Chat, Skill, LoungeArea, LoungeAreaMember)
from SocialImpactNetwork.models import FieldsOfWork, ContactQuestions


class SocialUserSerializer(ModelSerializer):
    class Meta:
        model = SocialUser
        fields = '__all__'

        def create(self, validated_data):
            return SocialUser.objects.create(**validated_data)


class CountrySerializer(ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'


class CitySerializer(ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'


class ResourceTypeSerializer(ModelSerializer):
    class Meta:
        model = ResourceType
        fields = '__all__'


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ResourceSerializer(ModelSerializer):
    resource_user = SocialUserSerializer(read_only=True, required=False)
    resource_type = ResourceTypeSerializer(read_only=True, required=False)
    resource_category = CategorySerializer(read_only=True, required=False, many=True)

    class Meta:
        model = Resource
        fields = [
            'resource_user',
            'resource_type',
            'resource_category'
        ]


class ProjectSerializer(ModelSerializer):
    resource = ResourceSerializer(read_only=True, required=False)

    class Meta:
        model = Project
        fields = '__all__'

        def create(self, validated_data):
            return Project.objects.create(**validated_data)


class LoungeAreaSerializer(ModelSerializer):
    created_by = SocialUserSerializer(read_only=True, required=False)

    class Meta:
        model = LoungeArea
        fields = '__all__'


class LoungeAreaMemberSerializer(ModelSerializer):
    lounge_area = LoungeAreaSerializer(read_only=True, required=False)

    class Meta:
        model = LoungeAreaMember
        fields = '__all__'


class ChatSerializer(ModelSerializer):
    lounge_area = LoungeAreaSerializer(read_only=True, required=False)
    project = ProjectSerializer(read_only=True, required=False)
    sent_by = SocialUserSerializer(read_only=True, required=False)

    class Meta:
        model = Chat
        fields = '__all__'

        def create(self, validated_data):
            return Chat.objects.create(**validated_data)


class ContactQuestionSerializer(ModelSerializer):
    project = ProjectSerializer(read_only=True)

    class Meta:
        model = ContactQuestions
        fields = '__all__'


class ContactQuestionAnswerSerializer(ModelSerializer):
    question = ContactQuestionSerializer(read_only=True)
    resource = ResourceSerializer(read_only=True, required=False)
    user = SocialUserSerializer(read_only=True)

    class Meta:
        model = ContactQuestionAnswer
        fields = '__all__'


class ContactSerializer(ModelSerializer):
    resource = ResourceSerializer(read_only=True, required=False)

    class Meta:
        model = Contact
        fields = '__all__'

        def create(self, validated_data):
            return Contact.objects.create(**validated_data)


class NetworkSerializer(ModelSerializer):
    resource = ResourceSerializer(read_only=True, required=False)

    class Meta:
        model = Network
        fields = '__all__'

        def create(self, validated_data):
            return Network.objects.create(**validated_data)


class SkillSerializer(ModelSerializer):
    resource_user = SocialUserSerializer(read_only=True, required=False)

    class Meta:
        model = Skill
        fields = '__all__'

        def create(self, validated_data):
            return Skill.objects.create(**validated_data)


class AffiliationSerializer(ModelSerializer):
    contact = ContactSerializer(read_only=True, required=False)

    class Meta:
        model = Affiliations
        # fields = [
        #     'contact',
        #     'organization',
        # ]
        fields = '__all__'

        # def create(self, validated_data):
        #     return Affiliations.objects.create(**validated_data)


class FieldOfWorkSerializer(ModelSerializer):
    network = ContactSerializer(read_only=True, required=False)

    class Meta:
        model = FieldsOfWork
        fields = '__all__'

        def create(self, validated_data):
            return FieldsOfWork.objects.create(**validated_data)


