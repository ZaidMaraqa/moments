from rest_framework.test import APITestCase
from quickstart.models import Post, customUser, Comment
from quickstart.api.serializers import PostSerializer, CommentSerializer, UserSerializer

class CommentSerializerTest(APITestCase):

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
        self.comment_serializer = CommentSerializer(instance=self.comment)

    def test_comment_serializer_contains_expected_fields(self):
        data = self.comment_serializer.data
        self.assertEqual(
            set(data.keys()),
            set(['id', 'user', 'post', 'comment_text', 'created_at', 'updated_at'])
        )

    def test_comment_serializer_user_field(self):
        data = self.comment_serializer.data
        user_serializer = UserSerializer(self.user)
        self.assertEqual(data['user'], user_serializer.data)

    def test_comment_serializer_post_field(self):
        data = self.comment_serializer.data
        post_serializer = PostSerializer(self.post)
        self.assertEqual(data['post'], post_serializer.data['id'])

    def test_comment_serializer_comment_text_field(self):
        data = self.comment_serializer.data
        self.assertEqual(data['comment_text'], self.comment.comment_text)

    def test_comment_serializer_created_at_field(self):
        data = self.comment_serializer.data
        self.assertEqual(data['created_at'], self.comment.created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'))

    def test_comment_serializer_updated_at_field(self):
        data = self.comment_serializer.data
        self.assertEqual(data['updated_at'], self.comment.updated_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'))
