from django.http import HttpResponse, request
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import NoteSerializer, MyTokenObtainPairSerializer, PostSerializer
from quickstart.models import Note, Post
from rest_framework import status
from django.http import HttpResponse
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]
    return Response(routes)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def getNotes(request):
    user = request.user
    serializer = NoteSerializer(user.note_set.all(), many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def getPosts(request):
    posts = Post.objects.all().order_by('-created_at')
    parser_classes = (MultiPartParser, FormParser)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# @api_view(['GET'])
# # @permission_classes([IsAuthenticated])
# # @authentication_classes([JWTAuthentication])          
# def getUserInfo(request):
#     user = request.user
#     serializer = UserSerializer
#     return Response(UserSerializer(user), status=status.HTTP_200_OK)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# @authentication_classes([JWTAuthentication])
# def getCurrentUser(request):
#     user = request.user
#     serializer = UserSerializer(user)
#     return Response(serializer.data)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# @authentication_classes([JWTAuthentication])
# def getUserList(request):
#     users = User.objects.all()
#     serializer = UserSerializer(users, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)