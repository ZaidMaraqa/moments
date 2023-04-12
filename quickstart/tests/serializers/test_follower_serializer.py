from rest_framework.test import APITestCase
from quickstart.models import customUser
from quickstart.api.serializers import FollowerSerializer

class FollowerSerializerTest(APITestCase):

    fixtures = [
        'quickstart/tests/default_user.json',
    ]

    def setUp(self):
        self.user = customUser.objects.get(username='sammy')
        self.follower_serializer = FollowerSerializer(instance=self.user)

    def test_follower_serializer_contains_expected_fields(self):
        data = self.follower_serializer.data
        self.assertEqual(
            set(data.keys()),
            set(['id', 'username', 'email', 'first_name', 'last_name', 'bio'])
        )

    def test_follower_serializer_id_field(self):
        data = self.follower_serializer.data
        self.assertEqual(data['id'], self.user.id)

    def test_follower_serializer_username_field(self):
        data = self.follower_serializer.data
        self.assertEqual(data['username'], self.user.username)

    def test_follower_serializer_email_field(self):
        data = self.follower_serializer.data
        self.assertEqual(data['email'], self.user.email)

    def test_follower_serializer_first_name_field(self):
        data = self.follower_serializer.data
        self.assertEqual(data['first_name'], self.user.first_name)

    def test_follower_serializer_last_name_field(self):
        data = self.follower_serializer.data
        self.assertEqual(data['last_name'], self.user.last_name)

    def test_follower_serializer_bio_field(self):
        data = self.follower_serializer.data
        self.assertEqual(data['bio'], self.user.bio)
