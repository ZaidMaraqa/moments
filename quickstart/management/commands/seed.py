import random
from django.core.management.base import BaseCommand
from django_seed import Seed
from faker import Faker
from quickstart.models import customUser, Post, Comment
import os
from webapp import settings

class Command(BaseCommand):
    help = 'Seeds the database with fake users, posts, and comments'

    def add_arguments(self, parser):
        parser.add_argument(
            '--users',
            default=10,
            type=int,
            help='Number of users to seed'
        )
        parser.add_argument(
            '--posts',
            default=5,
            type=int,
            help='Number of posts per user to seed'
        )
        parser.add_argument(
            '--comments',
            default=2,
            type=int,
            help='Number of comments per post to seed'
        )

    def handle(self, *args, **options):

        def get_random_image():
            image_folder = os.path.join(settings.MEDIA_ROOT, 'images')
            images = [os.path.join('images', f) for f in os.listdir(image_folder) if os.path.isfile(os.path.join(image_folder, f))]
            return random.choice(images)
        
        def short_sentence(fake, max_words=10):
            return ' '.join(fake.words(nb=random.randint(1, max_words)))
        
        seeder = Seed.seeder()
        fake = Faker()  

        seeder.add_entity(customUser, options['users'], {
            'bio': lambda x: short_sentence(fake),
        })

        inserted_users = seeder.execute()
        inserted_users_pks = [user.pk for user in customUser.objects.filter(pk__in=inserted_users[customUser])]
        
        for user_pk in inserted_users_pks:
            user = customUser.objects.get(pk=user_pk)
            seeder.add_entity(Post, options['posts'], {
                'user': user,
                'creator_username': user.username,
                'reported': 0,
                'text': lambda x: short_sentence(fake),
                'image': lambda x: get_random_image(),
            })

            inserted_posts = seeder.execute()
            inserted_posts_pks = [post.pk for post in Post.objects.filter(pk__in=inserted_posts[Post])]

            for post_pk in inserted_posts_pks:
                post = Post.objects.get(pk=post_pk)
                seeder.add_entity(Comment, options['comments'], {
                    'user': lambda x: random.choice(customUser.objects.all()),
                    'post': post,
                })

        seeder.execute()
        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))
