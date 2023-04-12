from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator
from webapp import settings

class Note(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    body = models.TextField()

def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)

class Post(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=False)
    text = models.CharField(max_length=280, blank=False)
    image = models.FileField(upload_to=upload_to, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    creator_username = models.CharField(max_length=50, default='')
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
    reported = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    comment_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = models.Manager()

    class Meta:
        ordering = ['-created_at']

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if not extra_fields.get('is_staff'):
            raise ValueError('A superuser must have is_staff=True')
        if not extra_fields.get('is_superuser'):
            raise ValueError('A superuser must have is_superuser=True')
        
        return self.create_user(email, password, **extra_fields)


class customUser(AbstractUser, PermissionsMixin):


    username = models.CharField(
        max_length=50,
        unique=True,
        blank=False,
        validators=[RegexValidator(
            regex=r'^\w{2,}$',
            message='Username must have at least two alphanumericals'
        )]
    )
    email = models.EmailField(unique=True, blank=False)
    first_name = models.CharField(max_length=50, unique=False, blank=False)
    last_name = models.CharField(max_length=50, unique=False, blank=False)
    bio = models.CharField(max_length=500, unique=False, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    followers = models.ManyToManyField('self', symmetrical=False, related_name='followed_by', blank=True)
    following = models.ManyToManyField('self', symmetrical=False, related_name='following_to', blank=True)
    profile_picture = models.ImageField(upload_to=upload_to, blank=True, null=True, default='images/default.png')
    blocked_users = models.ManyToManyField('self', symmetrical=False, related_name='blocked_by', blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'username']

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    
    def follow(self, user):
        self.following.add(user)
        user.followers.add(self)

    def unfollow(self, user):
        self.following.remove(user)
        user.followers.remove(self)

    def block(self, user):
        self.blocked_users.add(user)
        if self.following.filter(id=user.id).exists():
            self.unfollow(user)
        if user.following.filter(id=self.id).exists():
            user.unfollow(self)
    
    def unblock(self, user):
        self.blocked_users.remove(user)

    def is_blocked(self, user):
        return self.blocked_users.filter(id=user.id).exists()

