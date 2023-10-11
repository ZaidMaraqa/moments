from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken
from quickstart.models import customUser

class TestLogInTestCase(APITestCase):

    fixtures = ['quickstart/test/default_user.json']

    def setUp(self):
        self.url = reverse('')