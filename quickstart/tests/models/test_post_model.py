from django.test import TestCase
from quickstart.models import Post, customUser
import os
import requests
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings
from django.core.exceptions import ValidationError

class PostModelTest(TestCase):

    fixtures = [
        'quickstart/tests/default_user.json',
    ]

    def setUp(self):
        self.user = customUser.objects.get(username='sammy')
        self.user2 = customUser.objects.create_user(
            email='testuser2@example.com',
            password='testpassword2',
            username='testuser2',
            first_name='Test',
            last_name='User2'
        )
        self.post = Post.objects.create(
            user=self.user,
            text='This is a test post.',
            creator_username = self.user.username
        )

    def test_create_post(self):
        post = Post.objects.get(pk=self.post.pk)
        self.assertEqual(post.user, self.user)
        self.assertEqual(post.text, 'This is a test post.')
        self.assertIsNotNone(post.created_at)
        self.assertEqual(post.creator_username, 'sammy')
        self.assertEqual(post.reported, 0)

    def assert_post_is_valid(self):
        """Raise an error if post is invalid."""

        try:
            self.post.full_clean()
        except (ValidationError):
            self.fail('Test user needs to be made valid')

    def assert_post_is_invalid(self):
        """Raise an error if post is valid."""

        with self.assertRaises(ValidationError):
            self.post.full_clean()


    def test_text_can_not_be_blank(self):
        self.post.text = ''
        self.assert_post_is_invalid()


    def test_like(self):
        self.post.likes.add(self.user2)
        self.assertTrue(self.post.likes.filter(pk=self.user2.pk).exists())
        self.assert_post_is_valid()

    def test_unlike(self):
        self.post.likes.add(self.user2)
        self.post.likes.remove(self.user2)
        self.assertFalse(self.post.likes.filter(pk=self.user2.pk).exists())

    def test_report(self):
        self.post.reported = 1
        self.post.save()
        post = Post.objects.get(pk=self.post.pk)
        self.assertEqual(post.reported, 1)
        self.assert_post_is_valid()

    def test_create_post_with_image(self):
        response = requests.get('http://localhost:8000/media/images/default.png')
        image = SimpleUploadedFile(
            name='default.png',
            content=BytesIO(response.content).read(),
            content_type='image/png'
        )
        post = Post.objects.create(
            user=self.user,
            text='This has an image.',
            image=image
        )
        self.assertTrue(post.image.name.startswith('images/default'))
        self.assert_post_is_valid()

    def test_post_ordering(self):
        post2 = Post.objects.create(user=self.user, text='This is another test post.')
        posts = Post.objects.all()
        self.assertEqual(posts[0], post2)
        self.assertEqual(posts[1], self.post)


    def tearDown(self):
        # Clean up the uploaded image files after each test
        for post in Post.objects.all():
            if post.image:
                os.remove(os.path.join(settings.MEDIA_ROOT, post.image.path))