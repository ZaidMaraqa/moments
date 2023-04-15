from rest_framework.test import APITestCase
from rest_framework import status
from quickstart.models import customUser, Post, Comment
from django.urls import reverse
from rest_framework_simplejwt.tokens import AccessToken

class CommentViewTestCase(APITestCase):
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
        self.comment = Comment.objects.create(
            user=self.user,
            post=self.post,
            comment_text='This is a test comment.'
        )
        self.url = reverse('post_comment', kwargs={'post_id': self.post.id})
        self.api_authentication()

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.access_token))

    def test_url(self):
        self.assertEqual(self.url, f'/api/posts/{self.post.id}/comment/')

    def test_get_comments(self):
        response = self.client.get(self.url)  
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_post_comment_success(self):
        comment_data = {
            'comment_text': 'This is a new test comment.',
            'user': self.user,
            'post': self.post.id,
        }
        response = self.client.post(self.url, data=comment_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.filter(post=self.post).count(), 2)

    def test_post_comment_invalid_post(self):
        comment_data = {
            'comment_text': 'This is a new test comment.',
            'user': self.user,
            'post': self.post.id,
        }
        response = self.client.post(f'/api/posts/{999}/comment/', data=comment_data)  # Use a non-existent post ID
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_comment_invalid_data(self):
        comment_data = {
            'comment_text': '' , # Empty comment_text
            'user': self.user,
            'post': self.post.id,
        }
        response = self.client.post(self.url, data=comment_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
