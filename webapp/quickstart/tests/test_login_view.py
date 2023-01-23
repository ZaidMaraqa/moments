from webapp.quickstart.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from webapp.quickstart.tests.helpers import LogInTester

class LogInViewTestCase(APITestCase, LogInTester):

    """Implement fixtures"""
    fixtures = ['webapp/quickstart/tests/fixtures/default_user.json']

    def setUp(self):
        self.url = reverse('Pending') # Insert here
        self.user = User.objects.get('username':'sammy')
        self.user_input = {'username':'sammy', 'password':'Password123'}

    def test_log_in_url(self):
        self.assertEqual(self.url, '/webapp/Pending')  #Insert here

    def test_sucessful_log_in(self):
        response = self.client.post(self.url, self.user_input, format ='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self._is_logged_in())

    def test_unsucessful_login_with_blank_username(self):
        self.user_input['username'] = ''
        response = self.client.post(self.url, self.user_input)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(self._is_logged_in())

    def test_unsucessful_login_with_blank_password(self):
        self.user_input['password'] = ''
        response = self.client.post(self.url, self.user_input)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(self._is_logged_in())

    def test_unsucessful_log_in(self):
        """Test wrong password is unsucessful"""
        self.user_input['password'] = 'Wrong1234'
        response = self.client.post(self.url, self.user_input)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(self._is_logged_in())
