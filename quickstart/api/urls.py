from django.urls import path
from . import views
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes),
    path('notes/', views.getNotes),
    path('posts/', views.getPosts),
    # path('userInfo/', views.getUserInfo),
    # path('currentUser/', views.getCurrentUser),
    # path('userList/', views.getUserList),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
