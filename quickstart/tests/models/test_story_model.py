from django.test import TestCase
from quickstart.models import Story, customUser
import os
import requests
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings
from django.core.exceptions import ValidationError


class StoryModelTestCase(TestCase):

    fixtures = [
        'quickstart/tests/default_user.json'
    ]

    def setUp(self):
        self.user = customUser.objects.get(username='sammy')
        self.response = requests.get('http://localhost:8000/media/images/default.png')
        self.image = SimpleUploadedFile(
            name='default.png',
            content=BytesIO(self.response.content).read(),
            content_type='image/png'
        )
        self.story = Story.objects.create(
            user = self.user,
            caption='testing',
            content=self.image,
            expires_at='2023-12-23'
        )

    
    def test_create_story(self):
        story = Story.objects.get(pk=self.story.pk)
        self.assertEqual(story.user, self.user)
        self.assertEqual(story.caption, 'testing')
        self.assertIsNotNone(story.created_at)
        # self.assertEqual(story.expires_at, datetime.datetime(2023, 12, 23, 0, 0, tzinfo=datetime.timezone.utc))
        self.assertTrue(story.content.name.startswith('images/default'))

    
    def assert_story_is_valid(self):
        try:
            self.story.full_clean()
        except (ValidationError):
            self.fail('Test user needs to be made valid')


    def assert_story_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.story.full_clean()

    def test_caption_can_be_blank(self):
        self.story.caption = ''
        self.assert_story_is_valid()

    def test_content_can_not_be_blank(self):
        self.story.content = ''
        self.assert_story_is_invalid()

    def test_content_can_not_be_null(self):
        self.story.content = None
        self.assert_story_is_invalid()

    def test_created_at_is_not_none(self):
        self.story.created_at = None
        self.assert_story_is_invalid()

    def test_caption_can_not_be_281_characters(self):
        self.story.caption = 'u' * 281
        self.assert_story_is_invalid()

    def test_caption_can_be_280_characters(self):
        self.story.caption = 'u' * 280
        self.assert_story_is_valid()

    def test_ordering_is_created_at(self):
        story2 = Story.objects.create(
            user = self.user,
            caption='hey',
            content=self.image,
            expires_at='2023-12-23',
        )
        stories = Story.objects.all()
        self.assertEqual(stories[0], story2)
        self.assertEqual(stories[1], self.story)
