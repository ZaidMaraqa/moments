from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken
from quickstart.models import customUser, Story

class StoryViewTestCase(APITestCase):

    fixtures = ['quickstart/tests/default_user.json']

    def setUp(self):
        self.user = customUser.objects.get(username='sammy')
        self.url = reverse('stories')
        self.access_token = AccessToken.for_user(self.user)
        self.api_authentication()
        self.story = Story.objects.create(user=self.user, caption='test', expires_at='2023-12-23')


    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.access_token))


    def test_get_stories(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_story(self):
        response = self.client.post(self.url, self.story, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    
    