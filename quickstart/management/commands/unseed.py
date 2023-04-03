from django.core.management.base import BaseCommand
from quickstart.models import customUser, Post, Comment

class Command(BaseCommand):
    help = 'Deletes all users, posts, and comments'

    def handle(self, *args, **options):
        Comment.objects.all().delete()
        Post.objects.all().delete()
        customUser.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Successfully unseeded database'))
