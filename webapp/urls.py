
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from quickstart import views
from django.views.generic import TemplateView

# router = routers.DefaultRouter()
# router.register(r'users', views.UserViewSet)
# router.register(r'groups', views.GroupViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('quickstart.api.urls')),
    # path('', TemplateView.as_view(template_name='index.html')),
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
