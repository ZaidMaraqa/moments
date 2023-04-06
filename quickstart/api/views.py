from django.http import HttpResponse, request, Http404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import NoteSerializer, MyTokenObtainPairSerializer, PostSerializer, SignupSerializer, BlockUserSerializer, ProfilePictureSerializer, UserSerializer, CommentSerializer
from quickstart.models import Note, Post, Comment, customUser
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework import generics, status
from rest_framework.decorators import action
from django.db.models import Q, F
from PIL import Image
from django.shortcuts import get_object_or_404
from django.core.paginator import Paginator
from rest_framework.pagination import PageNumberPagination
from .recommender import get_recommendations


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    

@api_view(['POST'])
def signup(request):
    serializer = SignupSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.save()
        if user:
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        
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


class CustomPageNumberPagination(PageNumberPagination):
    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })
    

class PostView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    
    def get(self, request, *args, **kwargs):
        following_users = request.user.following.all()  # replace with the queryset of the users that the current user follows
        following_user_ids = [user.id for user in following_users]
        posts = Post.objects.filter(Q(user_id__in=following_user_ids) & ~Q(user_id=request.user.id))

        # page = request.query_params.get('page', 1)  # Get the 'page' parameter or default to 1
        paginator = CustomPageNumberPagination()
        paginated_posts = paginator.paginate_queryset(posts, request) # Create a Paginator instance with 10 items per page

        serializer = PostSerializer(paginated_posts, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request, *args, **kwargs):
        posts_serializer = PostSerializer(data=request.data)
        if posts_serializer.is_valid():
            posts_serializer.validated_data['user'] = request.user 
            posts_serializer.validated_data['creator_username'] = request.user.username
            posts_serializer.save()
            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id, user=request.user)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found or not authorized.'}, status=status.HTTP_404_NOT_FOUND)

        post.delete()
        return Response({'message': 'Post successfully deleted.'}, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def report_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

    post.reported = F('reported') + 1
    post.save()
    post.refresh_from_db()

    if post.reported >= 3:
        post.delete()
        return Response({'message': 'Post deleted due to multiple reports.'}, status=status.HTTP_200_OK)

    return Response({'message': 'Post reported.'}, status=status.HTTP_200_OK)
        

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def recommended_posts(request):
    user_id = request.user.id
    recommended_posts = get_recommendations(request, user_id)
    serializer = PostSerializer(recommended_posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def getUserPosts(request, user_id):
    try:
        posts = Post.objects.filter(user_id=user_id)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



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
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])          
def getUserProfile(request, user_id):
    try:
        user = customUser.objects.get(id=user_id)
    except customUser.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    is_following = request.user.following.filter(id=user_id).exists()
    serializer = UserSerializer(user)
    response_data = serializer.data
    response_data['is_following'] = is_following
    return Response(response_data, status=status.HTTP_200_OK)



class editUserProfile(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    parser_classes = [MultiPartParser]
    http_method_names = ['patch'] 
    

    def patch(self, request, user_id):
        try:
            user = customUser.objects.get(id=user_id)
        except customUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.id != int(user_id):
            return Response({'error': 'Can not edit another user profile!'}, status=status.HTTP_403_FORBIDDEN)

        # retrieve the uploaded file from the request.FILES dictionary
        profile_picture = request.FILES.get('profile_picture')
        print("request.FILES:", request.FILES)
        print("request.data:", request.data)

        if profile_picture:
            profile_picture_serializer = ProfilePictureSerializer(user, data=request.data, partial=True) 
            if profile_picture_serializer.is_valid():
                profile_picture_serializer.save()
            else:
                return Response(profile_picture_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Remove the profile_picture from request.data before passing to UserSerializer
        data = request.data.dict()
        data.pop('profile_picture', None)

        serializer = UserSerializer(user, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def getCurrentUser(request, user_id):
    user = customUser.objects.get(id=user_id)
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def getUserRecommendations(request, user_id):
    try:
        user = customUser.objects.get(id=user_id)
    except customUser.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    followers = user.followers.all()
    following = user.following.all()

    mutals = following.intersection(followers)

    mutals_follow = set()
    for mutal in mutals:
        mutals_follow.update(mutal.followers.all())
        mutals_follow.update(mutal.following.all())

    blocked_users = user.blocked_users.all()
    recommendations = (mutals_follow - set(following) - set(blocked_users)) - {user}


    serializer = UserSerializer(recommendations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


class BlockView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = customUser.objects.all()
    serializer_class = BlockUserSerializer


    def post(self, request, *args, **kwargs):
        action = request.query_params.get('action', None)
        user_block = self.get_object()
        if action == 'block':
            request.user.block(user_block)
        elif action == 'unblock':
            request.user.unblock(user_block)
        else:
            return Response({"detail": "Invalid action parameter"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class getBlock(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, user_id):
        target_user = get_object_or_404(customUser, id=user_id)
        blocked = request.user.blocked_users.filter(id=user_id).exists()
        return Response({'is_blocked': blocked}, status=status.HTTP_200_OK)


class UserListView(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [JWTAuthentication]
    

    queryset = customUser.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        qs = customUser.objects.all()
        username = self.request.query_params.get('username')
        if username is not None:
            qs = qs.filter(username__icontains=username)
        return qs
    
class UserFollowView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


    queryset = customUser.objects.all()
    serializer_class = UserSerializer()
    

    @action(detail=True, methods=['post'])
    def follow(self, request, user_id=None):
        user = customUser.objects.get(id=user_id)
        if request.user.is_blocked(user):
            return Response({'status': 'error', 'message': 'Cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        if request.user != user:
            if not request.user.following.filter(id=user_id).exists():
                request.user.follow(user)
                return Response({'status': 'followed'}, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'error', 'message': 'You are already following this user.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'status': 'error', 'message': 'Cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=True, methods=['post'])
    def unfollow(self, request, user_id=None):
        user = customUser.objects.get(id=user_id)
        if request.user != user:
            if request.user.following.filter(id=user_id).exists():
                request.user.unfollow(user)
                return Response({'status': 'unfollowed'})
            else:
                return Response({'status': 'error', 'message': 'You are not following this user.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'status': 'error', 'message': 'Cannot unfollow yourself.'}, status=status.HTTP_400_BAD_REQUEST)



class LikeView(APIView):
    
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        post.likes.add(request.user)
        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CommentView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, post_id):
        comments = Comment.objects.filter(post=post_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

