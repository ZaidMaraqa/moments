# Generated by Django 4.1.3 on 2023-03-23 20:25

from django.db import migrations, models
import quickstart.models


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0002_customuser_profile_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='profile_picture',
            field=models.ImageField(blank=True, default='default.png', null=True, upload_to=quickstart.models.upload_to),
        ),
    ]
