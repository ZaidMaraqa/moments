from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken
from quickstart.models import customUser, Post

class PostViewTestCase(APITestCase):

    fixtures = ['quickstart/tests/default_user.json']

    def setUp(self):
        self.url = reverse('posts_list')
        self.user = customUser.objects.get(username='sammy')
        self.access_token = AccessToken.for_user(self.user)
        self.post = Post.objects.create(user=self.user, text='Test post', creator_username=self.user.username)
        self.api_authentication()

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.access_token))

    def test_get_posts(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('results' in response.data)

    def test_create_post(self):
        # data = {
        #     'title': 'New post',
        #     'content': 'This is a new post'
        # }
        response = self.client.post(self.url, self.post, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # self.assertEqual(response.data['title'], data['title'])
        # self.assertEqual(response.data['content'], data['content'])
        # self.assertEqual(response.data['user'], self.user.id)

    def test_delete_post(self):
        url = reverse(f'posts_list/{self.post.id}')
        print('nooooo')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('message' in response.data)
