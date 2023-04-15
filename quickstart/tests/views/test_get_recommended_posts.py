from rest_framework.test import APITestCase
from rest_framework import status
from quickstart.models import customUser, Post
from quickstart.api.serializers import PostSerializer
from django.urls import reverse
from rest_framework_simplejwt.tokens import AccessToken

class RecommendedPostsTestCase(APITestCase):
    fixtures = [
        'quickstart/tests/default_user.json',
    ]

    def setUp(self):
        self.user = customUser.objects.get(username='sammy')
        self.access_token = AccessToken.for_user(self.user)
        self.url = reverse('recommended_posts')
        self.api_authentication()

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.access_token))

    def test_recommended_posts(self):
        # You can implement the get_recommendations function in the test or mock it.
        # For simplicity, let's just create a few sample posts here.
        sample_posts = [
            Post.objects.create(
                user=self.user,
                text='This is a sample post 1.'
            ),
            Post.objects.create(
                user=self.user,
                text='This is a sample post 2.'
            )
        ]

        response = self.client.get(self.url)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        serializer = PostSerializer(sample_posts, many=True)
        print(serializer.data)
        self.assertEqual(response.data, serializer.data)
