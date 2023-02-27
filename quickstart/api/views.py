from django.http import HttpResponse, request
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import NoteSerializer, MyTokenObtainPairSerializer, PostSerializer, SignupSerializer, UserSerializer
from quickstart.models import Note, Post
from rest_framework import status
from django.http import HttpResponse
from rest_framework.parsers import MultiPartParser, FormParser
from quickstart.models import customUser
from rest_framework.decorators import parser_classes
from rest_framework.views import APIView

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def signup(request):
    serializer = SignupSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.save()
        if user:
            return Response(status=status.HTTP_201_CREATED)
        
    return Response(serializer.errors, status=400)   

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

class PostView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        posts_serializer = PostSerializer(data=request.data)
        if posts_serializer.is_valid():
            posts_serializer.save(user=request.user)
            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET'])
# # @permission_classes([IsAuthenticated])
# # @authentication_classes([JWTAuthentication])
# @parser_classes([MultiPartParser, FormParser])
# def getPosts(request):
#     posts = Post.objects.all().order_by('-created_at')
#     serializer = PostSerializer(posts, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)

# @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# # @authentication_classes([JWTAuthentication])
# @parser_classes([MultiPartParser, FormParser])
# def addPosts(request, *args, **kwargs):
#     posts_serializer = PostSerializer(data=request.data)
#     if posts_serializer.is_valid():
#         posts_serializer.save()
#         return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
#     else:
#         print("Error:", posts_serializer.errors)
#         return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
# @authentication_classes([JWTAuthentication])          
def getUserInfo(request):
    user = request.user
    serializer = UserSerializer
    return Response(UserSerializer(user), status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def getCurrentUser(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
# @authentication_classes([JWTAuthentication])
def getUserList(request):
    users = customUser.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)