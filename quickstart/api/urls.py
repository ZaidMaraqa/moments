from django.urls import path
from . import views
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes),
    path('notes/', views.getNotes),
    path('posts/', views.PostView.as_view(), name= 'posts_list'),
    path('posts/user/<int:user_id>/', views.getUserPosts, name='user-posts'),
    path('posts/<int:post_id>/comment/', views.CommentView.as_view(), name='post_comment'),
    path('posts/<int:post_id>/like/', views.LikeView.as_view(), name='post_like'),
    path('signup/', views.signup, name='signup'),
    path('user/<int:user_id>/profile/', views.getUserProfile, name='user-profile'),
    path('users/<int:user_id>/follow/', views.UserFollowView.as_view({'post': 'follow'})),
    path('users/<int:user_id>/unfollow/', views.UserFollowView.as_view({'post': 'unfollow'})),
    path('users/<int:user_id>/', views.getCurrentUser),
    path('userList/', views.UserListView.as_view({'get': 'list'}), name='user_list'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
