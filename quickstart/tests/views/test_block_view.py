from rest_framework.test import APITestCase
from rest_framework import status
from quickstart.models import customUser
from django.urls import reverse
from rest_framework_simplejwt.tokens import AccessToken

class BlockViewTestCase(APITestCase):
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
        self.url = reverse('toggle_block_user', kwargs={'pk': self.target_user.id})
        self.api_authentication()

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.access_token))

    def test_block_user_success(self):
        response = self.client.post(f'{self.url}?action=block')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(self.target_user in self.user.blocked_users.all())

    def test_unblock_user_success(self):
        self.user.blocked_users.add(self.target_user)
        response = self.client.post(f'{self.url}?action=unblock')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(self.target_user in self.user.blocked_users.all())

    def test_invalid_action(self):
        response = self.client.post(f'{self.url}?action=invalid_action')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"detail": "Invalid action parameter"})

    def test_non_existent_user(self):
        non_existent_user_url = reverse('toggle_block_user', kwargs={'pk': 999})
        response = self.client.post(f'{non_existent_user_url}?action=block')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

