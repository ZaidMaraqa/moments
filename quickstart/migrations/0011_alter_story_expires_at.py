# Generated by Django 4.1.3 on 2023-09-06 15:47

from django.db import migrations, models
import quickstart.models


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0010_alter_story_expires_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='story',
            name='expires_at',
            field=models.DateTimeField(default=quickstart.models.Story.twenty_four_hours_hence),
        ),
    ]
