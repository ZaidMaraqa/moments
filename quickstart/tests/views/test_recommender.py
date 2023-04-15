from django.test import TestCase
from quickstart.models import customUser, Post
from quickstart.api.recommender import get_recommendations

class RecommenderTestCase(TestCase):
    fixtures = [
        'quickstart/tests/default_user.json',
    ]

    def setUp(self):
        self.user = customUser.objects.get(username='sammy')

        # Create test posts
        self.posts = [
            Post.objects.create(user=self.user, text='Test post 1'),
            Post.objects.create(user=self.user, text='Test post 2'),
            Post.objects.create(user=self.user, text='Test post 3'),
            Post.objects.create(user=self.user, text='Test post 4'),
            Post.objects.create(user=self.user, text='Test post 5')
        ]

        # Add likes to the posts
        self.posts[0].likes.add(self.user)
        self.posts[1].likes.add(self.user)
        self.posts[2].likes.add(self.user)

    def test_get_recommendations(self):

        class MockRequest:
            def __init__(self, user):
                self.user = user

        mock_request = MockRequest(self.user)

        recommendations = get_recommendations(mock_request, self.user.id, n_recommendations=2)

       
        for recommendation in recommendations:
            self.assertIsInstance(recommendation, Post)

        self.assertEqual(len(recommendations), 2)
