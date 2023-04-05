from quickstart.models import customUser
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

class LogInViewTestCase(APITestCase):

    """Implement fixtures"""
    fixtures = ['quickstart/tests/default_user.json']

    def setUp(self):
        self.url = reverse('token_obtain_pair')
        self.user = customUser.objects.get(username='sammy')
        self.user.set_password('Password123')
        self.user.save()
        self.user_input = {'email': 'sammy@example.org', 'password': 'Password123'}

    def test_log_in_url(self):
        self.assertEqual(self.url, '/api/token/')

    def test_sucessful_log_in(self):
        self.user.is_active = True
        self.user.save()
        response = self.client.post(self.url, self.user_input, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unsucessful_login_with_blank_username(self):
        self.user_input['email'] = ''
        response = self.client.post(self.url, self.user_input)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unsucessful_login_with_blank_password(self):
        self.user_input['password'] = ''
        response = self.client.post(self.url, self.user_input)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unsucessful_log_in(self):
        """Test wrong password is unsucessful"""
        self.user_input['password'] = 'Wrong1234'
        response = self.client.post(self.url, self.user_input)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
