from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from quickstart.models import Post, customUser, Comment
from quickstart.api.serializers import PostSerializer, CommentSerializer, UserSerializer
import requests
from io import BytesIO

class PostSerializerTest(APITestCase):

    fixtures = [
        'quickstart/tests/default_user.json',
    ]

    def setUp(self):
        self.user = customUser.objects.get(username='sammy')
        self.post = Post.objects.create(
            user=self.user,
            text='This is a test post.'
        )
        self.comment = Comment.objects.create(
            user=self.user,
            post=self.post,
            comment_text='This is a test comment.'
        )
        self.post_serializer = PostSerializer(instance=self.post)

    def test_post_serializer_contains_expected_fields(self):
        data = self.post_serializer.data
        self.assertEqual(
            set(data.keys()),
            set(['id', 'text', 'image', 'created_at', 'user', 'likes', 'comments'])
        )

    def test_post_serializer_user_field(self):
        data = self.post_serializer.data
        user_serializer = UserSerializer(self.user)
        self.assertEqual(data['user'], user_serializer.data)

    def test_post_serializer_comments_field(self):
        data = self.post_serializer.data
        comment_serializer = CommentSerializer(self.comment)
        self.assertEqual(data['comments'], [comment_serializer.data])

    def test_post_serializer_likes_field(self):
        data = self.post_serializer.data
        user_serializer = UserSerializer(self.user)
        self.assertEqual(data['likes'], [])

    def test_post_serializer_image_field(self):
        response = requests.get('http://localhost:8000/media/images/default.png')
        image = SimpleUploadedFile(
            name='default.png',
            content=BytesIO(response.content).read(),
            content_type='image/png'
        )
        self.post.image = image
        self.post.save()

        post_serializer = PostSerializer(instance=self.post)
        data = post_serializer.data
        self.assertTrue(data['image'].startswith('/media/images/default'))



