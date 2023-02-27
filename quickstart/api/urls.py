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
    path('signup/', views.signup),
    path('userInfo/', views.getUserInfo),
    path('currentUser/', views.getCurrentUser),
    path('userList/', views.getUserList),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
