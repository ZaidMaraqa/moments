# Generated by Django 4.1.3 on 2023-02-08 16:28

from django.db import migrations, models
import quickstart.models


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0003_remove_post_photo_post_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='image',
            field=models.FileField(blank=True, null=True, upload_to=quickstart.models.upload_to),
        ),
    ]