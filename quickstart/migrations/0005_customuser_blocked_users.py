# Generated by Django 4.1.3 on 2023-03-30 14:52

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0004_alter_customuser_profile_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='blocked_users',
            field=models.ManyToManyField(blank=True, related_name='blocked_by', to=settings.AUTH_USER_MODEL),
        ),
    ]
