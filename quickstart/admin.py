from django.contrib import admin
from .models import Note, Post, customUser
from django.contrib.auth.admin import UserAdmin


admin.site.register(Note)
admin.site.register(Post)
admin.site.register(customUser, UserAdmin)