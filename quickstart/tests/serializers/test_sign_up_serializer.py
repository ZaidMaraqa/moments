from rest_framework.test import APITestCase
from rest_framework.exceptions import ValidationError
from quickstart.models import customUser
from quickstart.api.serializers import SignupSerializer

class SignupSerializerTest(APITestCase):

    def setUp(self):
        self.valid_data = {
            'username': 'new_user',
            'first_name': 'New',
            'last_name': 'User',
            'email': 'new_user@example.com',
            'bio': 'New user bio',
            'password1': 'testpassword',
            'password2': 'testpassword',
        }

    def test_signup_serializer_create_user(self):
        serializer = SignupSerializer(data=self.valid_data)
        serializer.is_valid(raise_exception=True)
        new_user = serializer.save()

        self.assertIsInstance(new_user, customUser)
        self.assertEqual(new_user.username, self.valid_data['username'])
        self.assertEqual(new_user.first_name, self.valid_data['first_name'])
        self.assertEqual(new_user.last_name, self.valid_data['last_name'])
        self.assertEqual(new_user.email, self.valid_data['email'])
        self.assertEqual(new_user.bio, self.valid_data['bio'])
        self.assertTrue(new_user.check_password(self.valid_data['password1']))

    def test_signup_serializer_validate_email(self):
        existing_user = customUser.objects.create_user(
            username='existing_user',
            email='existing_user@example.com',
            password='testpassword'
        )

        invalid_data = self.valid_data.copy()
        invalid_data['email'] = existing_user.email
        serializer = SignupSerializer(data=invalid_data)

        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_signup_serializer_validate_passwords(self):
        invalid_data = self.valid_data.copy()
        invalid_data['password1'] = 'password1'
        invalid_data['password2'] = 'password2'
        serializer = SignupSerializer(data=invalid_data)

        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)



    def test_password_cant_be_blank(self):
        self.valid_data ['password1'] = ''
        serializer = SignupSerializer (data=self.valid_data )
        self.assertFalse(serializer.is_valid())
        before_count = customUser .objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count)

    def test_valid_sign_up_serializer(self):
        serializer = SignupSerializer (data=self.valid_data)
        self.assertTrue(serializer.is_valid())


    def test_username_cant_longer_50_characters(self):
        self.valid_data ['username'] = 'u' * 51
        serializer = SignupSerializer (data=self.valid_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser .objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count)

    def test_username_can_be_50_characters_(self):
        self.valid_data ['username'] = 'u' * 50
        serializer = SignupSerializer (data=self.valid_data )
        self.assertTrue(serializer.is_valid())
        before_count = customUser .objects.count()
        serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count-1, before_count)

    def test_username_cannot_be_1_character(self):
        self.valid_data ['username'] = 'b' * 1
        serializer = SignupSerializer (data=self.valid_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser .objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count)

    def test_username_must_not_be_blank(self):
        self.valid_data ['username'] = ''
        serializer = SignupSerializer (data=self.valid_data)
        self.assertFalse(serializer.is_valid())
        before_count = customUser .objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count)

    def test_email_must_not_be_blank(self):
        self.valid_data ['email'] = ''
        serializer = SignupSerializer (data=self.valid_data )
        self.assertFalse(serializer.is_valid())
        before_count = customUser .objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count)
        
    def test_email_must_have_at_symbol(self):
        self.valid_data ['email'] = 'zaidexample.org'
        serializer = SignupSerializer (data=self.valid_data )
        self.assertFalse(serializer.is_valid())
        before_count = customUser .objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count)

    def test_email_must_have_domain_name(self):
        self.valid_data ['email'] = 'zaid@.org'
        serializer = SignupSerializer (data=self.valid_data )
        self.assertFalse(serializer.is_valid())
        before_count = customUser .objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count)

    def test_email_must_have_domain(self):
        self.valid_data ['email'] = 'zaid@example'
        serializer = SignupSerializer (data=self.valid_data )
        self.assertFalse(serializer.is_valid())
        before_count = customUser .objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count)

    def test_firstname_cant_longer_50_characters(self):
        self.valid_data ['first_name'] = 'b' * 51
        serializer = SignupSerializer (data=self.valid_data )
        self.assertFalse(serializer.is_valid())
        before_count = customUser .objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count)

    def test_first_name_can_be_50_characters_(self):
        self.valid_data ['first_name'] = 'b' * 50
        serializer = SignupSerializer (data=self.valid_data )
        self.assertTrue(serializer.is_valid())
        before_count = customUser .objects.count()
        serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_first_name_can_be_3_characters(self):
        self.valid_data ['first_name'] = 'b' * 3
        serializer = SignupSerializer (data=self.valid_data )
        self.assertTrue(serializer.is_valid())
        before_count = customUser .objects.count()
        serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_first_name_must_not_be_blank(self):
        self.valid_data ['first_name'] = ''
        serializer = SignupSerializer (data=self.valid_data )
        self.assertFalse(serializer.is_valid())
        before_count = customUser .objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count)

    def test_lastname_must_not_be_longer_50_characters(self):
        self.valid_data ['last_name'] = 'b' * 51
        serializer = SignupSerializer (data=self.valid_data )
        self.assertFalse(serializer.is_valid())
        before_count = customUser .objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count)

    def test_last_name_can_be_50_characters_(self):
        self.valid_data ['last_name'] = 'b' * 50
        serializer = SignupSerializer (data=self.valid_data )
        self.assertTrue(serializer.is_valid())
        before_count = customUser .objects.count()
        serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_last_name_can_be_3_characters(self):
        self.valid_data ['last_name'] = 'b' * 3
        serializer = SignupSerializer (data=self.valid_data )
        self.assertTrue(serializer.is_valid())
        before_count = customUser .objects.count()
        serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_last_name_must_not_be_blank(self):
        self.valid_data ['last_name'] = ''
        serializer = SignupSerializer (data=self.valid_data )
        self.assertFalse(serializer.is_valid())
        before_count = customUser .objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count)

    def test_bio_can_be_500_characters_(self):
        self.valid_data ['bio'] = 'b' * 500
        serializer = SignupSerializer (data=self.valid_data )
        self.assertTrue(serializer.is_valid())
        before_count = customUser .objects.count()
        serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_bio_can_be_3_characters(self):
        self.valid_data ['bio'] = 'b' * 3
        serializer = SignupSerializer (data=self.valid_data )
        self.assertTrue(serializer.is_valid())
        before_count = customUser .objects.count()
        serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count+1)

    def test_bio_cannnot_be_501_characters(self):
        self.valid_data ['bio'] = 'b' * 501
        serializer = SignupSerializer (data=self.valid_data )
        self.assertFalse(serializer.is_valid())
        before_count = customUser .objects.count()
        with self.assertRaises(AssertionError):
            serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count)

    def test_bio_can_be_blank(self):
        self.valid_data ['bio'] = ''
        serializer = SignupSerializer (data=self.valid_data )
        self.assertTrue(serializer.is_valid())
        before_count = customUser .objects.count()
        serializer.save()
        after_count = customUser .objects.count()
        self.assertEqual(after_count, before_count+1)