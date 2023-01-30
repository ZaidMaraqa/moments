# from quickstart.models import User
# from django.urls import reverse
# from rest_framework.test import APITestCase
# from rest_framework import status
# # from quickstart.tests.helpers import LogInTester

# class SignUpViewTestCase(APITestCase):

#     fixtures = ['webapp/quickstart/tests/fixtures/default_user.json']

#     def setUp(self):
#         self.url = reverse('signup')
#         self.user = User.objects.get(username='sammy')
#         self.form_input = {
#             'username':'zaid',
#             'first_name':'Zaid',
#             'last_name':'Maraqa',
#             'email':'zaidmaraqa@example.com',
#             'bio':'CS at KCL'
#             'password':'Password@123',
#         }

#     def test_sign_up_url(self):
#         self.assertEqual(self.url, '/webapp/quickstart/signup/')

#     def test_succesful_signup(self):
#         self.assertFalse(self._is_logged_in())
#         before_count = User.objects.count()
#         response = self.client.post(self.url, self.form_input)
#         after_count = User.objects.count()
#         self.assertEqual(before_count + 1, after_count)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertTrue(self._is_logged_in())

#         """Unit tests for blank inputs"""

#     def test_unsucessful_signup_blank_first_name(self):
#         self.assertFalse(self._is_logged_in())
#         before_count = User.objects.count()
#         self.form_input['first_name'] = ''
#         response = self.client.post(self.url, self.form_input)
#         after_count = User.objects.count()
#         self.assertEqual(before_count, after_count)
#         self.assertEqual(response.status_code,LogInTester status.HTTP_400_BAD_REQUEST)
#         self.assertFalse(self._is_logged_in())

#     def test_unsucessful_signup_blank_last_name(self):
#         self.assertFalse(self._is_logged_in())
#         before_count = User.objects.count()
#         self.form_input['last_name'] = ''
#         response = self.client.post(self.url, self.form_input)
#         after_count = User.objects.count()
#         self.assertEqual(before_count, after_count)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertFalse(self._is_logged_in())

#     def test_unsucessful_signup_blank_email(self):
#         self.assertFalse(self._is_logged_in())
#         before_count = User.objects.count()
#         self.form_input['email'] = ''
#         response = self.client.post(self.url, self.form_input)
#         after_count = User.objects.count()
#         self.assertEqual(before_count, after_count)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertFalse(self._is_logged_in())

#     def test_unsucessful_signup_blank_username(self):
#         self.assertFalse(self._is_logged_in())
#         before_count = User.objects.count()
#         self.form_input['username'] = ''
#         response = self.client.post(self.url, self.form_input)
#         after_count = User.objects.count()
#         self.assertEqual(before_count, after_count)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertFalse(self._is_logged_in())

#     def test_unsucessful_signup_blank_password(self):
#         self.assertFalse(self._is_logged_in())
#         before_count = User.objects.count()
#         self.form_input['password'] = ''
#         response = self.client.post(self.url, self.form_input)
#         after_count = User.objects.count()
#         self.assertEqual(before_count, after_count)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertFalse(self._is_logged_in())

#     def test_succesful_signup_with_blank_bio(self):
#         self.assertFalse(self._is_logged_in())
#         before_count = User.objects.count()
#         self.form_input['bio'] = ''
#         response = self.client.post(self.url, self.form_input)
#         after_count = User.objects.count()
#         self.assertEqual(before_count + 1, after_count)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertTrue(self._is_logged_in())

#     """Unit tests for uniqueness"""

#     def test_unsucessful_signup_non_unique_username(self):
#         self.assertFalse(self._is_logged_in())
#         """If this test fails try those commented lines"""
#         # input = self.form_input
#         # input['username'] = self.user.username
#         self.form_input['username'] = self.user.username
#         before_count = User.objects.count()
#         response = self.client.post(self.url, self.form_input)
#         after_count = User.objects.count()
#         self.assertEqual(before_count, after_count)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertFalse(self._is_logged_in())

#     def test_unsucessful_signup_non_unique_email(self):
#         self.assertFalse(self._is_logged_in())
#         self.form_input['email'] = self.user.email
#         before_count = User.objects.count()
#         response = self.client.post(self.url, self.form_input)
#         after_count = User.objects.count()
#         self.assertEqual(before_count, after_count)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertFalse(self._is_logged_in())

#     def test_succesful_signup_with_non_unique_first_name(self):
#         self.assertFalse(self._is_logged_in())
#         before_count = User.objects.count()
#         self.form_input['first_name'] = self.user.first_name
#         response = self.client.post(self.url, self.form_input)
#         after_count = User.objects.count()
#         self.assertEqual(before_count + 1, after_count)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertTrue(self._is_logged_in())

#     def test_succesful_signup_with_non_unique_last_name(self):
#         self.assertFalse(self._is_logged_in())
#         before_count = User.objects.count()
#         self.form_input['last_name'] = self.user.first_name
#         response = self.client.post(self.url, self.form_input)
#         after_count = User.objects.count()
#         self.assertEqual(before_count + 1, after_count)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertTrue(self._is_logged_in())

#     def test_succesful_signup_with_non_unique_bio(self):
#         self.assertFalse(self._is_logged_in())
#         before_count = User.objects.count()
#         self.form_input['bio'] = self.user.bio
#         response = self.client.post(self.url, self.form_input)
#         after_count = User.objects.count()
#         self.assertEqual(before_count + 1, after_count)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertTrue(self._is_logged_in())

#         """Unit tests for password"""

#     def test_unsucessful_signup_with_password_that_does_not_contain_number(self):
#         self.assertFalse(self._is_logged_in())
#         self.form_input['password'] = 'Password'
#         before_count = User.objects.count()
#         response = self.client.post(self.url, self.form_input)
#         after_count = User.objects.count()
#         self.assertEqual(before_count, after_count)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertFalse(self._is_logged_in())
