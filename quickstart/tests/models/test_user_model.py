from quickstart.models import customUser
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase

class UserModelTestCase(APITestCase):
    """Unit tests for User model."""

    fixtures = [
        'quickstart/tests/default_user.json',
    ]

    def setUp(self):
        self.user = customUser.objects.get(username='sammy')
        self.second_user = customUser.objects.create_user(
            email='test@example.com',
            password='test_password',
            first_name='Test',
            last_name='User',
            bio = 'hi',
            username='testuser'
        )

    def assert_user_is_valid(self):
        """Raise an error if user is invalid."""

        try:
            self.user.full_clean()
        except (ValidationError):
            self.fail('Test user needs to be made valid')

    def assert_user_is_invalid(self):
        """Raise an error if user is valid."""

        with self.assertRaises(ValidationError):
            self.user.full_clean()

    def test_valid_user(self):
        """Test if the current user is valid."""

        self.assert_user_is_valid()

    def test_follow(self):
        self.user.follow(self.second_user)
        self.assertTrue(self.user.following.filter(pk=self.second_user.pk).exists())
        self.assertTrue(self.second_user.followers.filter(pk=self.user.pk).exists())
        self.assert_user_is_valid()

    def test_unfollow(self):
        self.user.follow(self.second_user)
        self.user.unfollow(self.second_user)
        self.assertFalse(self.user.following.filter(pk=self.second_user.pk).exists())
        self.assertFalse(self.second_user.followers.filter(pk=self.user.pk).exists())
        self.assert_user_is_valid()
    
    def test_block(self):
        self.user.block(self.second_user)
        self.assertTrue(self.user.blocked_users.filter(pk=self.second_user.pk).exists())
        self.assertFalse(self.user.following.filter(pk=self.second_user.pk).exists())
        self.assertFalse(self.second_user.followers.filter(pk=self.user.pk).exists())
        self.assert_user_is_valid()

    def test_unblock(self):
        self.user.block(self.second_user)
        self.user.unblock(self.second_user)
        self.assertFalse(self.user.blocked_users.filter(pk=self.second_user.pk).exists())
        self.assert_user_is_valid()

    def test_is_blocked(self):
        self.user.block(self.second_user)
        self.assertTrue(self.user.is_blocked(self.second_user))
        self.user.unblock(self.second_user)
        self.assertFalse(self.user.is_blocked(self.second_user))
        self.assert_user_is_valid()


    """ Unit test for username """

    def test_username_must_be_unique(self):
        self.user.username = self.second_user.username
        self.assert_user_is_invalid()

    def test_username_must_not_be_longer_50_characters(self):
        self.user.username = 'u' * 51
        self.assert_user_is_invalid()

    def test_username_can_have_50_characters(self):
        self.user.username = 'u' * 50
        self.assert_user_is_valid()

    def test_username_must_not_be_blank(self):
        self.user.username = ''
        self.assert_user_is_invalid()

    def test_username_must_contain_at_least_2_alphanumericals(self):
        self.user.username = 'u'
        self.assert_user_is_invalid()

    def test_username_must_not_contain_more_than_one_at(self):
        self.user.username = 'zaid@@example.org'
        self.assert_user_is_invalid()

    """ Unit test for email """

    def test_email_must_be_unique(self):
        self.user.email = self.second_user.email
        self.assert_user_is_invalid()

    def test_email_must_have_before_at_symbol(self):
        self.user.email = '@example.org'
        self.assert_user_is_invalid()

    def test_email_must_have_at_symbol(self):
        self.user.email = 'zaidexample.org'
        self.assert_user_is_invalid()

    def test_email_must_include_domain_name(self):
        self.user.email = 'zaid@.org'
        self.assert_user_is_invalid()

    def test_email_must_include_domain(self):
        self.user.email = 'zaid@example'
        self.assert_user_is_invalid()

    def test_email_must_not_be_blank(self):
        self.user.username = ''
        self.assert_user_is_invalid()

    """ Unit test for first_name """

    def test_first_name_need_not_be_unique(self):
        self.user.first_name = self.second_user.first_name
        self.assert_user_is_valid()

    def test_first_name_must_not_be_longer_50_characters(self):
        self.user.first_name = 'a' * 51
        self.assert_user_is_invalid()

    def test_first_name_can_have_50_characters(self):
        self.user.first_name = 'a' * 50
        self.assert_user_is_valid()

    def test_first_name_must_not_be_blank(self):
        self.user.first_name = ''
        self.assert_user_is_invalid()

    """ Unit test for last_name """

    def test_last_name_need_not_be_unique(self):
        self.user.last_name = self.second_user.last_name
        self.assert_user_is_valid()

    def test_last_name_must_not_be_longer_50_characters(self):
        self.user.last_name = 'b' * 51
        self.assert_user_is_invalid()

    def test_last_name_can_have_50_characters(self):
        self.user.last_name = 'b' * 50
        self.assert_user_is_valid()

    def test_last_name_must_not_be_blank(self):
        self.user.last_name = ''
        self.assert_user_is_invalid()

    """ Unit test for bio """

    def test_bio_can_be_blank(self):
        self.user.bio = ''
        self.assert_user_is_valid()

    def test_bio_need_not_be_unique(self):
        self.user.bio = self.second_user.bio
        self.assert_user_is_valid()

    def test_bio_must_not_be_longer_500_characters(self):
        self.user.bio = 'c' * 501
        self.assert_user_is_invalid()

    def test_bio_can_have_500_characters(self):
        self.user.bio = 'c' * 500
        self.assert_user_is_valid()

    """ Unit test for superuser """

    def test_is_superuser_must_be_true_for_superuser(self):
        with self.assertRaises(ValueError):
            self.superuser = customUser.objects.create_superuser(
                username = 'superuser',
                email = 'superuser@example.org',
                first_name = 'Super',
                last_name = 'User',
                password = 'Password123',
                is_staff = True,
                is_superuser = False
            )

    def test_is_staff_must_be_true_for_superuser(self):
        with self.assertRaises(ValueError):
            self.superuser = customUser.objects.create_superuser(
                username = 'superuser',
                email = 'superuser@example.org',
                first_name = 'Super',
                last_name = 'User',
                password = 'Password123',
                is_staff = False,
                is_superuser = True
            )