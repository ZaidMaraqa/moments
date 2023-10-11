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
    path('posts/<int:post_id>/report/', views.report_post, name='report_post'),
    path('posts/<int:post_id>/comment/', views.CommentView.as_view(), name='post_comment'),
    path('posts/<int:post_id>/like/', views.LikeView.as_view(), name='post_like'),
    path('posts/<int:post_id>/delete/', views.PostDeleteView.as_view(), name='post_delete'),
    path('recommended_posts/', views.recommended_posts, name='recommended_posts'),
    path('signup/', views.signup, name='signup'),
    path('user/<int:user_id>/profile/', views.getUserProfile, name='user-profile'),
    path('users/<int:user_id>/follow/', views.UserFollowView.as_view({'post': 'follow'})),
    path('users/<int:user_id>/unfollow/', views.UserFollowView.as_view({'post': 'unfollow'})),
    path('users/<int:user_id>/accept_follow_request/', views.UserFollowView.as_view({'post': 'accept_follow_request'})),
    path('users/<int:user_id>/reject_follow_request/', views.UserFollowView.as_view({'post': 'reject_follow_request'})),
    path('user/<int:pk>/toggle_block/', views.BlockView.as_view(), name='toggle_block_user'),
    path('user/<int:user_id>/block_status/', views.getBlock.as_view(), name='get_blocked'),
    path('users/<int:user_id>/recommendations/', views.getUserRecommendations),
    path('verify-details/', views.VerifyDetailsView.as_view(), name='verify-details'),
    path('users/<int:user_id>/', views.getCurrentUser, name='current_user'),
    path('userList/', views.UserListView.as_view({'get': 'list'}), name='user_list'),
    path('toggle-visibility/', views.toggle_visibility, name='toggle-visibility'),
    path('user/<int:user_id>/edit/', views.editUserProfile.as_view(), name='edit-user-profile'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('stories/', views.StoryView.as_view(), name='stories'),
    path('stories/<int:story_id>/', views.StoryView.as_view(), name='story-detail'),
]
