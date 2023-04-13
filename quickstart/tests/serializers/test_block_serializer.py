from rest_framework.test import APITestCase
from quickstart.models import customUser
from quickstart.api.serializers import BlockUserSerializer

class BlockUserSerializerTest(APITestCase):

    def setUp(self):
        self.user = customUser.objects.create_user(
            username='test_user',
            email='test_user@example.com',
            password='testpassword'
        )
        self.block_user_serializer = BlockUserSerializer(instance=self.user)

    def test_block_user_serializer_contains_expected_field(self):
        data = self.block_user_serializer.data
        self.assertEqual(
            set(data.keys()),
            set(['id'])
        )

    def test_block_user_serializer_id_field(self):
        data = self.block_user_serializer.data
        self.assertEqual(data['id'], self.user.id)
