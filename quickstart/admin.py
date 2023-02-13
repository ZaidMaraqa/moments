from django.contrib import admin
from .models import Note, Post, User


admin.site.register(Note)
admin.site.register(Post)
admin.site.register(User)