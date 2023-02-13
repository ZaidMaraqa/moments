from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions
from quickstart.serializers import UserSerializer, GroupSerializer

def index(request):
    return render(request, 'index.html')

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all().order_by('-date_joined')
#     serializer_class = UserSerializer
#     permission_classes = [permissions.IsAuthenticated]


# class GroupViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = GroupSerializer
#     permission_classes = [permissions.IsAuthenticated]
