from rest_framework.serializers import ModelSerializer
from quickstart.models import Note, Post, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...
    

        return token


class NoteSerializer(ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'



class PostSerializer(serializers.ModelSerializer):
    # author = serializers.SlugRelatedField(slug_field='username' ,queryset=User.objects.all())
    creator_id = serializers.ReadOnlyField(source='creator.id')
    image_url = serializers.ImageField(required=False)
    class Meta:
        model = Post
        fields = ['id', 'text', 'image', 'created_at','creator_id', 'image_url']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'bio', 'password']
        extra_kwargs = {'password': {'write_only': True}}