from rest_framework.test import APITestCase
from rest_framework import status
from quickstart.models import customUser
from django.urls import reverse
from rest_framework_simplejwt.tokens import AccessToken

class GetBlockTestCase(APITestCase):
    fixtures = [
        'quickstart/tests/default_user.json',
    ]

    def setUp(self):
        self.user = customUser.objects.get(username='sammy')
        self.access_token = AccessToken.for_user(self.user)
        self.target_user = customUser.objects.create(
            username='target_user',
            email='target@example.com',
            first_name='Target',
            last_name='User',
            password='testpassword'
        )
        self.url = reverse('get_blocked', kwargs={'user_id': self.target_user.id})
        self.api_authentication()

    def test_url(self):
        self.assertEqual(self.url, f'/api/user/{self.target_user.id}/block_status/')

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.access_token))

    def test_get_block_status_not_blocked(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'is_blocked': False})

    def test_get_block_status_blocked(self):
        self.user.blocked_users.add(self.target_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'is_blocked': True})

    def test_get_block_status_non_existent_user(self):
        non_existent_user_url = reverse('get_blocked', kwargs={'user_id': 999})
        response = self.client.get(non_existent_user_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
