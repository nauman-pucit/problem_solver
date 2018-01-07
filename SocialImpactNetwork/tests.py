"""this file contains unittests of the application
unittest regarding register user are written in TestRegisterUser class"""
import json
import os
import unittest

import django
from django.test import Client
from django.core.urlresolvers import reverse
import requests
from requests.auth import HTTPBasicAuth

os.environ['DJANGO_SETTINGS_MODULE'] = 'ProblemSolverCentral.settings'
django.setup()
from authentication.models import SocialUser
from SocialImpactNetwork.models import (Contact, Resource, Project, Network, Chat, ContactQuestions, Affiliations,
                                        ResourceType, Category)


class TestIndexView(unittest.TestCase):
    """
    This class contains tests for Index view of social_network
    """

    def setUp(self):
        """
        This sets up request to test Index view
        :return:
        """
        self.client = Client()
        self.index_view_url = reverse('social_network')

    def test_index_view(self):
        """
        This function makes request to the Index view
        :return:
        """
        response = self.client.get(self.index_view_url)
        self.assertEqual(response.status_code, 200)


class TestAffiliationsView(unittest.TestCase):
    """
    This class contains tests for get_affiliations view
    """

    def setUp(self):
        """
        This sets up request to test get_affiliations view
        :return:
        """
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.contact = Contact.objects.create(contact_name='nauman', contact_email='nauman@gmail.com',
                                              contact_description='description')

        self.affiliaion = Affiliations.objects.create(contact=self.contact, organization='qubee')
        self.client = Client()
        self.affiliaions_view_url = reverse('affiliations', args=[self.contact.id])

    def test_affiliations_view(self):
        """
        This function makes request to the get_affiliations view
        :return:
        """
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.get(self.affiliaions_view_url)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        self.affiliaion.delete()
        self.contact.delete()
        self.user.delete()


class TestChatView(unittest.TestCase):
    """
    This class contains tests for ChatViewSet
    """

    def setUp(self):
        """
        This sets up request to test ChatViewSet view
        :return:
        """
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.resource_type = ResourceType.objects.create(resource_type='funding')
        self.resource = Resource.objects.create(resource_user=self.user, resource_type=self.resource_type)

        self.project = Project.objects.create(project_name='project_name', project_description='project_description',
                                              resource=self.resource)
        self.client = Client()
        self.chat = Chat.objects.create(project=self.project, sent_by=self.user, message='Hi')
        self.data = {
            'projectId': self.project.id
        }
        self.get_chat_view_url = reverse('get_chat')

    def test_chat_view_set(self):
        """
        This function makes request to the ChatViewSet view
        :return:
        """
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.post(self.get_chat_view_url, json.dumps(self.data), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        self.resource.delete()
        self.chat.delete()
        self.resource_type.delete()
        self.user.delete()
        self.project.delete()


class TestUpdateProjectView(unittest.TestCase):
    """
    This class contains tests for updating a project
    """

    def setUp(self):
        """
        This sets up request to update project
        :return:
        """
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.resource_type = ResourceType.objects.create(resource_type='funding')
        self.resource = Resource.objects.create(resource_user=self.user, resource_type=self.resource_type)

        self.project = Project.objects.create(project_name='project_name', project_description='project_description',
                                              resource=self.resource)
        self.contact = Contact.objects.create(contact_name='nauman', contact_email='nauman@gmail.com',
                                              contact_description='description')
        self.affiliation = Affiliations.objects.create(contact=self.contact, organization='qubee')
        self.question = ContactQuestions.objects.create(project=self.project, question='what you need?')
        self.client = Client()

        self.data = {
            'projectId': self.project.id,
            'contactId': self.contact.id,
            'project_name': 'project',
            'project_description': 'project_description',
            'contact_name': 'contact',
            'contact_email': 'nauman@gmail.com',
            'contact_description': 'contact_description',
            'worldwide': json.dumps(True),
            'citywide': json.dumps(True),
            'orgnaizations': [{
                'id': self.affiliation.id,
                'name': 'QC'
            }, {
                'id': 'id',
                'name': 'QC'
            }],
            'questions': [{
                'id': self.question.id,
                'name': 'new '
            }, {
                'id': "id",
                'name': 'new question'
            }],
        }
        self.update_project_view_url = reverse('update_project')

    def test_update_project_view(self):
        """
        This function makes request to update project
        :return:
        """
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.post(self.update_project_view_url, json.dumps(self.data),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def tearDown(self):
        """
        This function sets back project information
        :return:
        """
        self.affiliation.delete()
        self.contact.delete()
        self.question.delete()
        self.project.delete()
        self.resource.delete()
        self.resource_type.delete()
        self.user.delete()


class TestDeleteProjectView(unittest.TestCase):
    """
    This class contains tests for deleting a project
    """

    def setUp(self):
        """
        This sets up request to delete project
        :return:
        """
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.resource_type = ResourceType.objects.create(resource_type='funding')
        self.resource = Resource.objects.create(resource_user=self.user, resource_type=self.resource_type)
        self.client = Client()
        project = Project.objects.create(project_name='project_name', project_description='project_description',
                                         resource=self.resource)
        self.data = {
            'projectId': project.id
        }
        self.delete_project_view_url = reverse('delete_project')

    def test_delete_project_view(self):
        """
        This function makes request to delete project
        :return:
        """
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.post(self.delete_project_view_url,
                                    json.dumps(self.data), content_type='application/json')
        self.assertEqual(response.status_code, 202)

    def tearDown(self):
        self.resource.delete()
        self.resource_type.delete()
        self.user.delete()


class TestUpdateNetworkView(unittest.TestCase):
    """
    This class contains tests for updating a network
    """

    def setUp(self):
        """
        This sets up request to update network
        :return:
        """
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.resource_type = ResourceType.objects.create(resource_type='funding')
        self.resource = Resource.objects.create(resource_user=self.user, resource_type=self.resource_type)

        self.network = Network.objects.create(network_name='project_name', network_description='project_description',
                                              resource=self.resource)
        self.contact = Contact.objects.create(contact_name='nauman', contact_email='nauman@gmail.com',
                                              contact_description='description')
        self.affiliation = Affiliations.objects.create(contact=self.contact, organization='qubee')
        self.client = Client()

        self.data = {
            'networkId': self.network.id,
            'contactId': self.contact.id,
            'network_name': 'network',
            'network_description': 'description',
            'contact_name': 'contact',
            'contact_email': 'nauman@gmail.com',
            'contact_description': 'contact_description',
            'worldwide': json.dumps(True),
            'citywide': json.dumps(True),
            'orgnaizations': [{
                'id': self.affiliation.id,
                'name': 'QC'
            }, {
                'id': 'id',
                'name': 'QC'
            }]
        }
        self.update_network_view_url = reverse('update_network')

    def test_update_network_view(self):
        """
        This function makes request to update contact
        :return:
        """
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.post(self.update_network_view_url, json.dumps(self.data),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def tearDown(self):
        """
        This function sets back contact information
        :return:
        """
        self.affiliation.delete()
        self.contact.delete()
        self.network.delete()
        self.resource.delete()
        self.resource_type.delete()
        self.user.delete()


class TestDeleteNetworkView(unittest.TestCase):
    """
    This class contains tests for deleting a network
    """

    def setUp(self):
        """
        This sets up request to delete network
        :return:
        """
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.resource_type = ResourceType.objects.create(resource_type='funding')
        self.resource = Resource.objects.create(resource_user=self.user, resource_type=self.resource_type)
        self.client = Client()
        network = Network.objects.create(network_name='network_name', network_description='network_description',
                                         resource=self.resource)
        self.data = {
            'networkId': network.id
        }
        self.delete_network_view_url = reverse('delete_network')

    def test_delete_network_view(self):
        """
        This function makes request to delete network
        :return:
        """
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.post(self.delete_network_view_url, json.dumps(self.data),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 202)

    def tearDown(self):
        self.resource.delete()
        self.resource_type.delete()
        self.user.delete()


class TestProjectsViewSet(unittest.TestCase):
    """
        This class contains tests for retrieving projects detail
        """

    def test_projects_view_set(self):
        """
        This function makes request to ProjectsViewSet
        :return:
        """
        response = requests.get('http://127.0.0.1:8000/social_network/projects/' + str(217))
        self.assertEqual(response.status_code, 200)


class TestPledgeNetworkView(unittest.TestCase):
    """
    This class tests PledgeNetwork view to save networks
    """

    def setUp(self):
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.resource_type = ResourceType.objects.create(resource_type='funding')
        self.resource = Resource.objects.create(resource_user=self.user, resource_type=self.resource_type)
        self.data = {"categories_selected": json.dumps([{"id": 1, "category_name": "education"}]),
                     "category": [],
                     "resource_type":"funding",
                     "network_name": "n",
                     "network_description": "n",
                     "contact_name": "contact_name",
                     "contact_description": "contact_description",
                     "contact_email": "contact_email",
                     "orgnaizations": json.dumps(["QC"]),
                     "worldwide": json.dumps(False),
                     "citywide": json.dumps(False),
                     "file": "sign_up1.png",
                     'city_model': json.dumps([{"id": 23185}, {"id": 23184}]),
                     'country_model': json.dumps([{"id": 254}]),

                     }
        self.client = Client()
        self.url = reverse('create_network-list')

    def test_pledge_network(self):
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.post(self.url, json.dumps(self.data), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def tearDown(self):
        self.resource.delete()
        self.resource_type.delete()
        self.user.delete()


class TestPledgeProjectsView(unittest.TestCase):
    """
    This class tests PledgeProjects view to save projects
    """

    def setUp(self):
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.resource_type = ResourceType.objects.create(resource_type='funding')
        self.resource = Resource.objects.create(resource_user=self.user, resource_type=self.resource_type)
        self.data = {"categories_selected": json.dumps([{"id": 1, "category_name": "education"}]),
                     "category": [],
                     "resource_type": "funding",
                     "project_name": "p",
                     "project_description": "p",
                     "contact_name": "contact_name",
                     "contact_description": "contact_description",
                     "contact_email": "contact_email",
                     "orgnaizations": json.dumps(["QC"]),
                     "worldwide": json.dumps(False),
                     "citywide": json.dumps(False),
                     "file": "sign_up1.png",
                     'city_model': json.dumps([{"id": 23185}, {"id": 23184}]),
                     'country_model': json.dumps([{"id": 254}]),
                     "questions": json.dumps(["q", "q", "q"])
                     }
        self.client = Client()
        self.url = reverse('create_project-list')

    def test_pledge_project(self):
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.post(self.url, json.dumps(self.data), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def tearDown(self):
        self.resource.delete()
        self.resource_type.delete()
        self.user.delete()


class TestAllUserProjects(unittest.TestCase):
    """
    This class tests AllUserProjectsViewSet
    """

    def setUp(self):
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.resource_type = ResourceType.objects.create(resource_type='funding')
        self.resource = Resource.objects.create(resource_user=self.user, resource_type=self.resource_type)
        self.client = Client()
        self.project = Project.objects.create(project_name='project_name', project_description='project_description',
                                         resource=self.resource)
        self.data = {
            'category': json.dumps({
                "id": 3,
                "category_name": "health"
            })
        }
        self.url = reverse('all_user_projects')

    def test_all_user_projects(self):
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.get(self.url, self.data)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        self.project.delete()
        self.resource.delete()
        self.resource_type.delete()
        self.user.delete()


class TestAllUserNetworks(unittest.TestCase):
    """
    This class tests AllUserNetworksViewSet
    """

    def setUp(self):
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.resource_type = ResourceType.objects.create(resource_type='funding')
        self.resource = Resource.objects.create(resource_user=self.user, resource_type=self.resource_type)
        self.network = Network.objects.create(network_name='project_name', network_description='project_description',
                                              resource=self.resource)
        self.client = Client()
        self.data = {
            'category': json.dumps({
                "id": 3,
                "category_name": "health"
            })
        }
        self.url = reverse('all_user_networks')

    def test_all_user_networks(self):
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.get(self.url, self.data)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        self.network.delete()
        self.resource.delete()
        self.resource_type.delete()
        self.user.delete()


class TestAllCategoriesViewSet(unittest.TestCase):
    """
    This class tests AllCategoriesViewSet
    """

    def setUp(self):
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()

    def test_all_categories(self):
        client = Client()
        client.login(username='testuser@gmail.com', password='123')
        response = client.get(reverse('category-list'))
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        self.user.delete()


class TestAllUserCategoriesViewSet(unittest.TestCase):
    """
    This class tests AllUserCategoriesViewSet
    """
    def setUp(self):
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()

    def test_all_user_categories(self):
        client = Client()
        client.login(username='testuser@gmail.com', password='123')
        response = client.get(reverse('all_user_categories'))
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        self.user.delete()


class TestAllResourceTypesViewSet(unittest.TestCase):
    def test_all_resource_types(self):
        client = Client()
        response = client.get(reverse('resourcetype-list'))
        self.assertEqual(response.status_code, 200)


class TestSendChatMessage(unittest.TestCase):
    """
    This class tests sending a new message in chat box
    """

    def setUp(self):
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.resource_type = ResourceType.objects.create(resource_type='funding')
        self.resource = Resource.objects.create(resource_user=self.user, resource_type=self.resource_type)
        self.client = Client()
        self.project = Project.objects.create(project_name='project_name', project_description='project_description',
                                              resource=self.resource)
        self.message_object = {"projectId": self.project.id, "message": "hi"}
        self.url = reverse('add_message')

    def test_send_chat_message(self):
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.post(self.url, self.message_object)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        self.project.delete()
        self.resource.delete()
        self.resource_type.delete()
        self.user.delete()


class TestProjectDetail(unittest.TestCase):
    """
    This class ProjectsViewSet to get project detail
    """

    def setUp(self):
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.client = Client()
        self.url = reverse('retrieve-project-list')

    def test_send_chat_message(self):
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        self.user.delete()


class TestContactQuestionAnswerViewSet(unittest.TestCase):
    """
    This class tests ContactQuestionAnswerViewSet
    """

    def setUp(self):
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.resource_type = ResourceType.objects.create(resource_type='funding')
        self.resource = Resource.objects.create(resource_user=self.user, resource_type=self.resource_type)

        self.project = Project.objects.create(project_name='project_name', project_description='project_description',
                                              resource=self.resource)
        self.client = Client()

    def test_contact_question_answer(self):
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.get(reverse('list-answers-list'))
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        self.project.delete()
        self.resource.delete()
        self.resource_type.delete()
        self.user.delete()


class TestSubmitContactForm(unittest.TestCase):
    """
    This class tests submit_contact_form view
    """

    def setUp(self):
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.resource_type = ResourceType.objects.create(resource_type='funding')
        self.resource = Resource.objects.create(resource_user=self.user, resource_type=self.resource_type)

        self.project = Project.objects.create(project_name='project_name', project_description='project_description',
                                              resource=self.resource)
        self.question = ContactQuestions.objects.create(project=self.project, question='what you need?')
        self.client = Client()
        self.submit_contact_form_url = reverse('submit_contact_form')
        self.answers_object = {self.question.id: {"answer": 'a'},
                               "projectId": self.project.id}

    def test_submit_contact_form(self):
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.post(self.submit_contact_form_url, json.dumps(self.answers_object),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        """
        This function sets back project information
        :return:
        """
        self.question.delete()
        self.project.delete()
        self.resource.delete()
        self.resource_type.delete()
        self.user.delete()


class TestCountriesViewSet(unittest.TestCase):
    """
    This class tests CountryViewSet
    """

    def setUp(self):
        self.client = Client()
        self.countries_url = reverse('get_countries')

    def test_countries_view_set(self):
        response = self.client.post(self.countries_url)
        self.assertEqual(response.status_code, 200)


class TestCitiesViewSet(unittest.TestCase):
    """
    This class tests CityViewSet
    """

    def setUp(self):
        self.client = Client()
        self.cities_url = reverse('get_cities')

    def test_cities_view_set(self):
        response = self.client.post(self.cities_url)
        self.assertEqual(response.status_code, 200)


class TestSocialNetworkSearch(unittest.TestCase):
    """
    This class tests SocialNetworkSearch
    """

    def setUp(self):
        self.client = Client()
        self.client2 = Client()
        self.search_url = reverse('search')
        self.category = Category.objects.create(category_name='funding')
        self.data = {"searchText": "p",
                     "category": json.dumps([{"id": self.category.id,
                                              "category_name": "funding"
                                              }]),
                     "city_model": json.dumps([{"id": 22838}]),
                     "country_model": json.dumps([{"id": 253}])
                     }
        self.data2 = {"searchText": "p",
                      "category": json.dumps([]),
                      "city_model": json.dumps([{"id": 22838}]),
                      "country_model": json.dumps([{"id": 253}])
                      }

    def test_social_network_search(self):
        response = self.client.post(self.search_url, self.data)
        response2 = self.client2.post(self.search_url, self.data2)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response2.status_code, 200)

    def tearDown(self):
        self.category.delete()


class TestRetrieveContact(unittest.TestCase):
    """
    This class tests retrieve contact view
    """

    def setUp(self):
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.resource_type = ResourceType.objects.create(resource_type='funding')
        self.resource = Resource.objects.create(resource_user=self.user, resource_type=self.resource_type)

        self.project = Project.objects.create(project_name='project_name', project_description='project_description',
                                              resource=self.resource)
        self.network = Network.objects.create(network_name='network_name', network_description='network_description',
                                              resource=self.resource)
        self.contact = Contact.objects.create(contact_name='nauman', contact_email='nauman@gmail.com',
                                              contact_description='description', project=self.project)
        self.contact2 = Contact.objects.create(contact_name='nauman', contact_email='nauman@gmail.com',
                                               contact_description='description', network=self.network)
        self.client = Client()
        self.url = reverse('get_contact')
        self.data = {
            'projectId': self.project.id,
            'networkId': ''
        }
        self.data2 = {
            'projectId': '',
            'networkId': self.network.id
        }

    def test_retrieve_contact(self):
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, 200)
        response = self.client.post(self.url, self.data2)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        """
        This function sets back project information
        :return:
        """
        self.contact.delete()
        self.contact2.delete()
        self.project.delete()
        self.network.delete()
        self.resource.delete()
        self.resource_type.delete()
        self.user.delete()


class TestGetUserProjects(unittest.TestCase):
    """
    This class tests PledgeProject's list method to get user projects
    """

    def setUp(self):
        self.client = Client()
        self.url = reverse('get_user_projects')

    def test_get_user_project(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 200)


class TestGetUserNetworks(unittest.TestCase):
    """
    This class tests PledgeNetwork's list method to get user networks
    """

    def setUp(self):
        self.client = Client()
        self.url = reverse('get_user_networks')

    def test_get_user_network(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 200)


class TestContactQuestionViewSet(unittest.TestCase):
    """
    This class test Contact Question viewset
    """

    def setUp(self):
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.resource_type = ResourceType.objects.create(resource_type='funding')
        self.resource = Resource.objects.create(resource_user=self.user, resource_type=self.resource_type)

        self.project = Project.objects.create(project_name='project_name', project_description='project_description',
                                              resource=self.resource)
        self.question = ContactQuestions.objects.create(project=self.project, question='what you need?')
        self.client = Client()
        self.url = reverse('get_questions')

    def test_contact_questions(self):
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        """
        This function sets back project information
        :return:
        """
        self.question.delete()
        self.project.delete()
        self.resource.delete()
        self.resource_type.delete()
        self.user.delete()
