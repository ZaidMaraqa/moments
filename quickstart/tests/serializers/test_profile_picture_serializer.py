from rest_framework.test import APITestCase
from quickstart.models import customUser
from quickstart.api.serializers import ProfilePictureSerializer
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
import os
import requests

class ProfilePictureSerializerTest(APITestCase):

    fixtures = [
        'quickstart/tests/default_user.json',
    ]

    def setUp(self):
        self.user = customUser.objects.get(username='sammy')
        self.profile_picture_serializer = ProfilePictureSerializer(instance=self.user)

    def test_profile_picture_serializer_contains_expected_fields(self):
        data = self.profile_picture_serializer.data
        self.assertEqual(set(data.keys()), set(['profile_picture']))

    def test_profile_picture_serializer_update(self):
        response = requests.get('https://via.placeholder.com/150')
        image = SimpleUploadedFile(
            name='test_image.jpg',
            content=BytesIO(response.content).read(),
            content_type='image/jpeg'
        )
        validated_data = {'profile_picture': image}
        updated_user = self.profile_picture_serializer.update(self.user, validated_data)

        # Check if the expected filename is present in the uploaded file's path
        self.assertTrue(updated_user.profile_picture.name.startswith('images/test_image'))

        # Clean up the uploaded file after the test
        if updated_user.profile_picture.path:
            os.remove(updated_user.profile_picture.path)

    def test_profile_picture_serializer_update_replaces_existing_picture(self):
        response_1 = requests.get('https://via.placeholder.com/150')
        image_1 = SimpleUploadedFile(
            name='test_image_1.jpg',
            content=BytesIO(response_1.content).read(),
            content_type='image/jpeg'
        )
        validated_data_1 = {'profile_picture': image_1}
        updated_user_1 = self.profile_picture_serializer.update(self.user, validated_data_1)

        response_2 = requests.get('https://via.placeholder.com/150')
        image_2 = SimpleUploadedFile(
            name='test_image_2.jpg',
            content=BytesIO(response_2.content).read(),
            content_type='image/jpeg'
        )
        validated_data_2 = {'profile_picture': image_2}
        updated_user_2 = self.profile_picture_serializer.update(self.user, validated_data_2)

        self.assertTrue(updated_user_2.profile_picture.name.startswith("images/test_image_2"))

        # Clean up the uploaded files after the test
        if updated_user_1.profile_picture.path and os.path.exists(updated_user_1.profile_picture.path):
            os.remove(updated_user_1.profile_picture.path)
        if updated_user_2.profile_picture.path and os.path.exists(updated_user_2.profile_picture.path):
            os.remove(updated_user_2.profile_picture.path)

