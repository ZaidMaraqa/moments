from django.contrib import admin
from .models import Note, Post


admin.site.register(Note)
admin.site.register(Post)
# admin.site.register(customUser)