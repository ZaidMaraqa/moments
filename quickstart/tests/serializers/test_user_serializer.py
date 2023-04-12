from quickstart.api.serializers import UserSerializer, FollowerSerializer, FollowingSerializer
from quickstart.models import customUser 
from rest_framework.test import APITestCase
from rest_framework.request import Request
from django.core.files.uploadedfile import SimpleUploadedFile

class MockRequest:
    def __init__(self, files=None):
        self.FILES = files or {}


class UserSerializerTest(APITestCase):

    fixtures = [
        'quickstart/tests/default_user.json',
    ]

    def setUp(self):
        self.user = customUser.objects.get(username='sammy')
        self.user2 = customUser.objects.create_user(
            username='following',
            email='following@example.com',
            password='test_password',
            first_name='Following',
            last_name='User'
        )
        self.serializer_data = {
            'username': 'zaid',
            'first_name': 'zaid',
            'last_name': 'maraqa',
            'email': 'zaid@example.org',
            'bio': 'zaid is the best!',
        }
        self.user_serializer = UserSerializer(instance=self.user)

    def test_user_serializer_contains_expected_fields(self):
        data = self.user_serializer.data
        self.assertEqual(
            set(data.keys()),
            set(['id', 'username', 'email', 'first_name', 'last_name', 'bio', 'followers', 'following', 
                 'followers_count', 'following_count', 'profile_picture'])
        )

    def test_valid_user_serializer(self):
        """Test the serializer to create a valid user."""

        serializer = UserSerializer(data=self.serializer_data)
        self.assertTrue(serializer.is_valid())


    def test_valid_user_serializer(self):
        """Test the serializer to create a valid user."""

        serializer = UserSerializer(data=self.serializer_data)
        self.assertTrue(serializer.is_valid())

    def test_serializer_saves_correctly(self):
        """Test that the serializer saves correctly."""

        serializer = UserSerializer(data=self.serializer_data)
        before_count = customUser.objects.count()
        serializer.is_valid()
        serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count + 1)
        user = customUser.objects.get(username="zaid")
        self.assertEqual(user.username, 'zaid')
        self.assertEqual(user.first_name, 'zaid')
        self.assertEqual(user.last_name, 'maraqa')
        self.assertEqual(user.email, 'zaid@example.org')
        self.assertEqual(user.bio, 'zaid is the best!')

    def test_username_must_not_be_longer_50_characters(self):
        """Test for the invalid serializer that can't be saved when the username contains more than 50 characters."""

        self.serializer_data['username'] = 'b' * 51
        serializer = UserSerializer(data=self.serializer_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser.objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count)

    def test_username_can_be_50_characters_(self):
        """Test for the invalid serializer that can be saved when the username contains 50 characterss."""

        self.serializer_data['username'] = 'b' * 50
        serializer = UserSerializer(data=self.serializer_data)
        self.assertTrue(serializer.is_valid())
        before_count = customUser.objects.count()
        serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_username_can_be_2_characters(self):
        """Test for the invalid serializer that can be saved when the username contains 50 characters."""

        self.serializer_data['username'] = 'b' * 2
        serializer = UserSerializer(data=self.serializer_data)
        self.assertTrue(serializer.is_valid())
        before_count = customUser.objects.count()
        serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_username_can_between_2_and_50_characters(self):
        """Test for the invalid serializer that can be saved when the username between 3 and 50 characters."""

        self.serializer_data['username'] = 'b' * 9
        serializer = UserSerializer(data=self.serializer_data)
        self.assertTrue(serializer.is_valid())
        before_count = customUser.objects.count()
        serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_username_cannot_be_1_characters(self):
        """Test for the invalid serializer that cannot be saved when the username contains 2 characterss."""

        self.serializer_data['username'] = 'b' * 1
        serializer = UserSerializer(data=self.serializer_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser.objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count)

    def test_username_must_not_be_blank(self):
        """Test for the invalid serializer that can't be saved when the username is blank."""

        self.serializer_data['username'] = ''
        serializer = UserSerializer(data=self.serializer_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser.objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count)

    def test_email_must_not_be_blank(self):
        """Test for the invalid serializer that can't be saved when the email is blank."""

        self.serializer_data['email'] = ''
        serializer = UserSerializer(data=self.serializer_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser.objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count)

    def test_email_must_have_before_at_symbol(self):
        """Test for the invalid serializer that can't be saved when the email has nothing before @"""

        self.serializer_data['email'] = '@example.org'
        serializer = UserSerializer(data=self.serializer_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser.objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count)

    def test_email_must_have_at_symbol(self):
        """Test for the invalid serializer that can't be saved when the email has no @"""

        self.serializer_data['email'] = 'baldunicornexample.org'
        serializer = UserSerializer(data=self.serializer_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser.objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count)

    def test_email_must_have_domain_name(self):
        """Test for the invalid serializer that can't be saved when the email has no domain name"""

        self.serializer_data['email'] = 'baldunicorn@.org'
        serializer = UserSerializer(data=self.serializer_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser.objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count)

    def test_email_must_have_domain(self):
        """Test for the invalid serializer that can't be saved when the email has no domain"""

        self.serializer_data['email'] = 'baldunicorn@example'
        serializer = UserSerializer(data=self.serializer_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser.objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count)

    def test_firstname_must_not_be_longer_50_characters(self):
        """Test for the invalid serializer that can't be saved when the firstname contains more than 50 characters."""

        self.serializer_data['first_name'] = 'b' * 51
        serializer = UserSerializer(data=self.serializer_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser.objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count)

    def test_first_name_can_be_50_characters_(self):
        """Test for the invalid serializer that can be saved when the firstname contains 50 characterss."""

        self.serializer_data['first_name'] = 'b' * 50
        serializer = UserSerializer(data=self.serializer_data)
        self.assertTrue(serializer.is_valid())
        before_count = customUser.objects.count()
        serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_first_name_can_be_2_characters(self):
        """Test for the invalid serializer that can be saved when the firstname contains 50 characters."""

        self.serializer_data['first_name'] = 'b' * 2
        serializer = UserSerializer(data=self.serializer_data)
        self.assertTrue(serializer.is_valid())
        before_count = customUser.objects.count()
        serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_first_name_must_not_be_blank(self):
        """Test for the invalid serializer that can't be saved when the first_name is blank."""

        self.serializer_data['first_name'] = ''
        serializer = UserSerializer(data=self.serializer_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser.objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count)

    def test_lastname_must_not_be_longer_50_characters(self):
        """Test for the invalid serializer that can't be saved when the lastname contains more than 50 characters."""

        self.serializer_data['last_name'] = 'b' * 51
        serializer = UserSerializer(data=self.serializer_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser.objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count)

    def test_last_name_can_be_50_characters_(self):
        """Test for the invalid serializer that can be saved when the lastname contains 50 characterss."""

        self.serializer_data['last_name'] = 'b' * 50
        serializer = UserSerializer(data=self.serializer_data)
        self.assertTrue(serializer.is_valid())
        before_count = customUser.objects.count()
        serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_last_name_can_be_2_characters(self):
        """Test for the invalid serializer that can be saved when the lastname contains 50 characters."""

        self.serializer_data['last_name'] = 'b' * 2
        serializer = UserSerializer(data=self.serializer_data)
        self.assertTrue(serializer.is_valid())
        before_count = customUser.objects.count()
        serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_last_name_must_not_be_blank(self):
        """Test for the invalid serializer that can't be saved when the last_name is blank."""

        self.serializer_data['last_name'] = ''
        serializer = UserSerializer(data=self.serializer_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser.objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count)

    def test_bio_can_be_500_characters_(self):
        """Test for the invalid serializer that can be saved when the bio contains 500 characterss."""

        self.serializer_data['bio'] = 'b' * 500
        serializer = UserSerializer(data=self.serializer_data)
        self.assertTrue(serializer.is_valid())
        before_count = customUser.objects.count()
        serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_bio_can_be_2_characters(self):
        """Test for the invalid serializer that can be saved when the bio contains 3 characters."""

        self.serializer_data['bio'] = 'b' * 2
        serializer = UserSerializer(data=self.serializer_data)
        self.assertTrue(serializer.is_valid())
        before_count = customUser.objects.count()
        serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_bio_cannnot_be_501_characters(self):
        """Test for the invalid serializer that can be saved when the bio 501 characters."""

        self.serializer_data['bio'] = 'b' * 501
        serializer = UserSerializer(data=self.serializer_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser.objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count)

    def test_bio_can_be_blank(self):
        """Test for the invalid serializer that can be saved when the bio is blank."""

        self.serializer_data['bio'] = ''
        serializer = UserSerializer(data=self.serializer_data)
        self.assertTrue(serializer.is_valid())
        before_count = customUser.objects.count()
        serializer.save()
        after_count = customUser.objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_get_followers(self):
        follower = customUser.objects.create_user(
            username='follower',
            email='follower@example.com',
            password='test_password',
            first_name='Follower',
            last_name='User'
        )
        self.user.followers.add(follower)

        serializer = UserSerializer()
        followers_data = serializer.get_followers(self.user)
        expected_followers_data = UserSerializer(self.user.followers.all(), many=True).data

        self.assertEqual(followers_data, expected_followers_data)

    def test_update_with_profile_picture(self):
        new_data = {
            'username': 'newusername',
            'first_name': 'New',
            'last_name': 'Name',
            'bio': 'New bio',
        }
        # Create a sample image file
        image_file = SimpleUploadedFile(
            "profile_picture.jpg",
            b"file_content",
            content_type="image/jpeg"
        )

        # Update the mock request with the image file
        mock_request = MockRequest(files={'profile_picture': image_file})

        user_serializer = UserSerializer(
            instance=self.user, data=new_data, partial=True, context={'request': mock_request}
        )
        user_serializer.is_valid(raise_exception=True)
        user_serializer.save()

        updated_user = customUser.objects.get(id=self.user.id)
        for field in new_data:
            self.assertEqual(getattr(updated_user, field), new_data[field])

        # Test if the profile picture was updated
        self.assertIsNotNone(updated_user.profile_picture)


    def test_update_without_profile_picture(self):
        new_data = {
            'username': 'newusername',
            'first_name': 'New',
            'last_name': 'Name',
            'bio': 'New bio',
        }
        mock_request = MockRequest()
        user_serializer = UserSerializer(instance=self.user, data=new_data, partial=True, context={'request': mock_request})
        user_serializer.is_valid(raise_exception=True)
        user_serializer.save()

        updated_user = customUser.objects.get(id=self.user.id)
        for field in new_data:
            self.assertEqual(getattr(updated_user, field), new_data[field])




    def test_update_with_invalid_data(self):
            new_data = {
                'username': '',
                'first_name': 'New',
                'last_name': 'Name',
                'bio': 'New bio',
            }
            user_serializer = UserSerializer(instance=self.user, data=new_data, partial=True, context={'request': None})
            self.assertFalse(user_serializer.is_valid())

    def test_following_field(self):
        self.user.following.add(self.user2)

        data = self.user_serializer.data
        following_serializer = FollowingSerializer(self.user2)
        self.assertEqual(data['following'], [following_serializer.data])

    def test_followers_and_following_count(self):
        following = customUser.objects.create_user(
            username='following2',
            email='following2@example.com',
            password='test_password',
            first_name='Following2',
            last_name='User2'
        )
        self.user.followers.add(self.user2)
        self.user.following.add(following)

        data = self.user_serializer.data
        self.assertEqual(data['followers_count'], self.user.followers.count())
        self.assertEqual(data['following_count'], self.user.following.count())

