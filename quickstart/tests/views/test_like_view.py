from rest_framework.test import APITestCase
from rest_framework import status
from quickstart.models import customUser, Post
from django.urls import reverse
from rest_framework_simplejwt.tokens import AccessToken

class LikeViewTestCase(APITestCase):
    fixtures = [
        'quickstart/tests/default_user.json',
    ]

    def setUp(self):
        self.user = customUser.objects.get(username='sammy')
        self.access_token = AccessToken.for_user(self.user)
        self.post = Post.objects.create(
            user=self.user,
            text='This is a test post.'
        )
        self.url = reverse('post_like', kwargs={'post_id': self.post.id})
        self.api_authentication()

    def test_url(self):
        self.assertEqual(self.url, f'/api/posts/{self.post.id}/like/')

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.access_token))

    def test_like_post_success(self):
        response = self.client.post(self.url)  
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.post.refresh_from_db()
        self.assertEqual(self.post.likes.count(), 1)

    def test_like_non_existent_post(self):
        response = self.client.post(f'/api/posts/999/like/')  # Use a non-existent post ID
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
