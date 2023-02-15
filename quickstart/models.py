from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from webapp import settings
from django.contrib.auth.models import User

class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    body = models.TextField()

def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)

class Post(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    text = models.CharField(max_length=280, blank=False)
    image = models.FileField(upload_to=upload_to, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


# class customUser(AbstractUser):


#     username = models.CharField(
#         max_length=50,
#         unique=True,
#         blank=False,
#         validators=[RegexValidator(
#             regex=r'^\w{2,}$',
#             message='Username must have at least two alphanumericals'
#         )]
#     )
#     email = models.EmailField(unique=True, blank=False)
#     first_name = models.CharField(max_length=50, unique=False, blank=False)
#     last_name = models.CharField(max_length=50, unique=False, blank=False)
#     bio = models.CharField(max_length=500, unique=False, blank=True)