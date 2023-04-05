from quickstart.models import customUser
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

class SignUpViewTestCase(APITestCase):

    fixtures = ['quickstart/tests/default_user.json']

    def setUp(self):
        self.url = reverse('signup')
        self.user = customUser.objects.get(username='sammy')
        self.form_input = {
            'username':'zaaid',
            'first_name':'Zaid',
            'last_name':'Maraqa',
            'email':'zaidmaaraqa@example.com',
            'bio':'CS at KCL',
            'password1':'Password@123',
            'password2':'Password@123',
        }

    def test_sign_up_url(self):
        self.assertEqual(self.url, '/api/signup/')

    def test_succesful_signup(self):
        before_count = customUser.objects.count()
        response = self.client.post(self.url, self.form_input) 
        after_count = customUser.objects.count()
        self.assertEqual(before_count + 1, after_count)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


        """Unit tests for blank inputs"""

    def test_unsucessful_signup_blank_first_name(self):
        
        before_count = customUser.objects.count()
        self.form_input['first_name'] = ''
        response = self.client.post(self.url, self.form_input)
        after_count = customUser.objects.count()
        self.assertEqual(before_count, after_count)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        

    def test_unsucessful_signup_blank_last_name(self):
        
        before_count = customUser.objects.count()
        self.form_input['last_name'] = ''
        response = self.client.post(self.url, self.form_input)
        after_count = customUser.objects.count()
        self.assertEqual(before_count, after_count)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        

    def test_unsucessful_signup_blank_email(self):
        
        before_count = customUser.objects.count()
        self.form_input['email'] = ''
        response = self.client.post(self.url, self.form_input)
        after_count = customUser.objects.count()
        self.assertEqual(before_count, after_count)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        

    def test_unsucessful_signup_blank_username(self):
        
        before_count = customUser.objects.count()
        self.form_input['username'] = ''
        response = self.client.post(self.url, self.form_input)
        after_count = customUser.objects.count()
        self.assertEqual(before_count, after_count)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        

    def test_unsucessful_signup_blank_password(self):
        
        before_count = customUser.objects.count()
        self.form_input['password1'] = ''
        response = self.client.post(self.url, self.form_input)
        after_count = customUser.objects.count()
        self.assertEqual(before_count, after_count)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        

    def test_succesful_signup_with_blank_bio(self):
        
        before_count = customUser.objects.count()
        self.form_input['bio'] = ''
        response = self.client.post(self.url, self.form_input)
        after_count = customUser.objects.count()
        self.assertEqual(before_count + 1, after_count)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        

    """Unit tests for uniqueness"""

    def test_unsucessful_signup_non_unique_username(self):
        
        """If this test fails try those commented lines"""
        # input = self.form_input
        # input['username'] = self.user.username
        self.form_input['username'] = self.user.username
        before_count = customUser.objects.count()
        response = self.client.post(self.url, self.form_input)
        after_count = customUser.objects.count()
        self.assertEqual(before_count, after_count)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        

    def test_unsucessful_signup_non_unique_email(self):
        
        self.form_input['email'] = self.user.email
        before_count = customUser.objects.count()
        response = self.client.post(self.url, self.form_input)
        after_count = customUser.objects.count()
        self.assertEqual(before_count, after_count)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        

    def test_succesful_signup_with_non_unique_first_name(self):
        
        before_count = customUser.objects.count()
        self.form_input['first_name'] = self.user.first_name
        response = self.client.post(self.url, self.form_input)
        after_count = customUser.objects.count()
        self.assertEqual(before_count + 1, after_count)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        

    def test_succesful_signup_with_non_unique_last_name(self):
        
        before_count = customUser.objects.count()
        self.form_input['last_name'] = self.user.first_name
        response = self.client.post(self.url, self.form_input)
        after_count = customUser.objects.count()
        self.assertEqual(before_count + 1, after_count)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        

    def test_succesful_signup_with_non_unique_bio(self):
        
        before_count = customUser.objects.count()
        self.form_input['bio'] = self.user.bio
        response = self.client.post(self.url, self.form_input)
        after_count = customUser.objects.count()
        self.assertEqual(before_count + 1, after_count)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        

        """Unit tests for password"""

    def test_unsucessful_signup_with_password_that_does_match_confirmation(self):
        
        self.form_input['password1'] = 'Password'
        before_count = customUser.objects.count()
        response = self.client.post(self.url, self.form_input)
        after_count = customUser.objects.count()
        self.assertEqual(before_count, after_count)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
