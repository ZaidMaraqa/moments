from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken
from quickstart.models import customUser


class SignUpViewTestCase(APITestCase):

    fixtures = ['quickstart/tests/default_user.json']

    def setUp(self):
        self.url = reverse('signup')
        self.form_data = {
            'username': 'amrooo',
            'first_name': 'amr',
            'last_name': 'maraqa',
            'bio': 'test',
            'email': 'amrooooo@gmail.com',
            'password1': 'amr2002',
            'password2': 'amr2002'

        }
        self.user = customUser.objects.get(username='sammy')

    def test_sign_up_url(self):
        self.assertEqual(self.url, f'/api/signup/')
    
    def test_succesful_sign_up(self):
        before_count = customUser.objects.count()
        response = self.client.post(self.url, self.form_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        after_count = customUser.objects.count()
        self.assertEqual(before_count + 1, after_count)

    def test_test_unsucessful_sign_up(self):
        self.form_data['password1'] = ''
        before_count = customUser.objects.count()
        response = self.client.post(self.url, self.form_data)
        after_count = customUser.objects.count()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(before_count, after_count)


    def test_user_can_not_sign_up_with_used_username(self):
        self.form_data['username'] = 'sammy'
        before_count = customUser.objects.count()
        response = self.client.post(self.url, self.form_data)
        after_count = customUser.objects.count()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(before_count, after_count)


    def test_user_can_sign_up_with_empty_bio(self):
        self.form_data['bio'] = ''
        before_count = customUser.objects.count()
        response = self.client.post(self.url, self.form_data)
        after_count = customUser.objects.count()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(before_count + 1, after_count)

    def test_user_can_not_sign_up_with_not_matching_password(self):
        self.form_data['password2'] = 'amr2001'
        before_count = customUser.objects.count()
        response = self.client.post(self.url, self.form_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        after_count = customUser.objects.count()
        self.assertEqual(before_count, after_count)

    def test_user_can_not_sign_up_with_used_email(self):
        self.form_data['email'] = 'sammy@example.org'
        before_count = customUser.objects.count()
        response = self.client.post(self.url, self.form_data)
        after_count = customUser.objects.count()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(before_count, after_count)

    def test_user_can_not_sign_up_with_username_longer_than_50(self):
        self.form_data['username'] = 'u' * 51
        before_count = customUser.objects.count()
        response = self.client.post(self.url, self.form_data)
        after_count = customUser.objects.count()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(before_count, after_count)

    def test_user_can_sign_up_with_50_username(self):
        self.form_data['username'] = 'u' * 50
        before_count = customUser.objects.count()
        response = self.client.post(self.url, self.form_data)
        after_count = customUser.objects.count()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(before_count + 1, after_count)
    
    def test_test_unsucessful_sign_up_with_invalid_email(self):
        self.form_data['email'] = 'amgmail.org'
        before_count = customUser.objects.count()
        response = self.client.post(self.url, self.form_data)
        after_count = customUser.objects.count()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(before_count, after_count)

    def test_test_unsucessful_sign_up_with_email_with_no_domain(self):
        self.form_data['email'] = 'amr@gmail'
        before_count = customUser.objects.count()
        response = self.client.post(self.url, self.form_data)
        after_count = customUser.objects.count()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(before_count, after_count)

