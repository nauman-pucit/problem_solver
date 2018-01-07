import json
import os
import unittest

import django
from django.test import Client
from django.test import TestCase

os.environ['DJANGO_SETTINGS_MODULE'] = 'ProblemSolverCentral.settings'
django.setup()

from django.core.urlresolvers import reverse

from authentication.models import SocialUser


class TestEmailExists(TestCase):
    """
    This class contains tests for CheckEmailExist view
    """
    def setUp(self):
        """
        This sets up request to test CheckEmailExist view
        :return:
        """
        self.client = Client()
        self.data = {
            'email': 'nauman@gmail.com',
        }
        self.checkEmailURL = reverse('check_email_exist')

    def test_check_email_exists(self):
        """
        This function makes request to the CheckEmailExist view
        :return:
        """
        response = self.client.post(self.checkEmailURL, json.dumps(self.data), content_type='application/json',
                                         HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 200)


class TestRegisterUser(TestCase):
    """
    This class tests the user registeration
    """

    def setUp(self):
        """
        This function initializes the variables that are used in the unittests to register user
        :return:
        """
        self.client = Client()
        self.data = {
            'firstName': 'nauman',
            'lastName': 'sharif',
            'email': 'nauman333@gmail.com',
            'password': '123',
            'moderation': False,
            'anonymity': False,
        }
        self.sign_up_url = reverse('sign_up')

    def test_register_user(self):
        """
        This function calls views.AllUsersViewSet and request as argument
        and registers the user with given data
        :return:
        """
        response = self.client.post(self.sign_up_url, json.dumps(self.data), content_type='application/json',
                                    HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 201)

    def tearDown(self):
        """
        This function destroys the user that was registered
        :return:
        """
        SocialUser.objects.get(email='nauman333@gmail.com').delete()


class TestUpdateUser(TestCase):
    """
        This class tests the user updating
    """
    def setUp(self):
        """
        This function initializes the variables that are used to update a user
        :return:
        """
        self.client = Client()
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        # self.user = SocialUser.objects.get(id=28)

        self.data = {
            'firstName': 'numan',
            'lastName': 'sharif',
            'anonymity': json.dumps(False),
            'moderation': json.dumps(False),
            'is_admin': json.dumps(False),
            'current_password': '123',
            'new_password': '1234'
        }
        self.update_user_url = reverse('update_user_account')

    def test_update_user(self):
        """
        This function calls views.AllUsersViewSet.update and request as argument
        and updates the user with the given data
        'yet not working'
        :return:
        """
        self.client.login(username='testuser@gmail.com', password='123')
        response = self.client.post(self.update_user_url, json.dumps(self.data), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        """
        this function updates the user back to original information
        :return:
        """
        self.user.delete()


class TestRetrieveUser(unittest.TestCase):
    """
        This class tests the user retrieve view
    """
    def setUp(self):
        """
        This function initializes the request to retrieve a user's information
        :return:
        """
        self.client = Client()
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser1@gmail.com',
                                               moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()

        self.retrieve_user_url = reverse('user_account')

    def test_retrieve_user(self):
        """
        this function calls views.AllUsersViewSet.retrieve and request as argument
        and checks if the user is retrieved successfully
        :return:
        """
        self.client.login(username='testuser1@gmail.com', password='123')
        response = self.client.post(self.retrieve_user_url)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        self.user.delete()


class TestUserAuthenticate(unittest.TestCase):
    """
    this class test the user authentication view
    """

    def setUp(self):
        """
        This function sets up request to login a user
        :return:
        """
        self.client = Client()
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser1@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.data = {
            'user_name': 'testuser1@gmail.com',
            'password': '123',
        }
        self.sign_in_url = reverse('sign_in_authenticate')

    def test_user_authentication(self):
        """
        This functions tests the SignInAuthenticate view
        :return:
        """
        response = self.client.post(self.sign_in_url, json.dumps(self.data), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        self.user.delete()


class TestCreateSuperUser(TestCase):
    """
    This class tests CreateSuperUser view
    """

    def setUp(self):
        """
        This function sets up request to test CreateSuperUser view
        :return:
        """
        self.client = Client()
        self.user = SocialUser.objects.create(firstName='nauman', lastName='sharif', email='testuser1@gmail.com',
                                              moderation=False, anonymity=False, is_admin=False)
        self.user.set_password('123')
        self.user.save()
        self.data = {
            'id': self.user.id,
        }
        self.change_user_role_url = reverse('change_user_role')

    def test_create_super_user(self):
        """
        this function tests CreateSuperUser view and tests response
        :return:
        """
        self.client.login(username='testuser1@gmail.com', password='123')
        response = self.client.post(self.change_user_role_url, json.dumps(self.data), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        self.user.delete()


class TestLogout(TestCase):
    """
    This class tests logout view
    """
    def setUp(self):
        self.client = Client()
        self.log_out_url = reverse('log_out')

    def test_logout(self):
        self.client.login(username='nauman@gmail.com', password='123')
        response = self.client.post(self.log_out_url)
        self.assertEqual(response.status_code, 204)


if __name__ == '__main__':
    unittest.main()