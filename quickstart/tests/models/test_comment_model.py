from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from quickstart.models import Comment, Post, customUser
from rest_framework.test import APITestCase

class CommentModelTest(APITestCase):

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

    def assert_comment_is_valid(self):
        try:
            self.comment.full_clean()
        except (ValidationError):
            self.fail('Test comment needs to be made valid')

    def assert_comment_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.comment.full_clean()

    def test_create_comment(self):
        comment = Comment.objects.get(pk=self.comment.pk)
        self.assertEqual(comment.user, self.user)
        self.assertEqual(comment.post, self.post)
        self.assertEqual(comment.comment_text, 'This is a test comment.')
        self.assertIsNotNone(comment.created_at)
        self.assertIsNotNone(comment.updated_at)

    def test_comment_user_cannot_be_blank(self):
        self.comment.user = None
        self.assert_comment_is_invalid()

    def test_comment_post_cannot_be_blank(self):
        self.comment.post = None
        self.assert_comment_is_invalid()
        

    def test_comment_text_cannot_be_blank(self):
        self.comment.comment_text = ''
        self.assert_comment_is_invalid()

    def test_ordering(self):
        new_comment = Comment.objects.create(
            user=self.user,
            post=self.post,
            comment_text='This is a newer test comment.'
        )

        # Retrieve the list of comments in descending order of creation
        comments = Comment.objects.all()

        # Check if the new comment is the first item in the list
        self.assertEqual(comments.first(), new_comment)
        # Check if the original comment is the second item in the list
        self.assertEqual(comments[1], self.comment)

    def tearDown(self):
        self.comment.delete()
