from rest_framework.serializers import ModelSerializer
from quickstart.models import Note, Post
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from quickstart.models import customUser



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


class SignupSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = customUser
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')

    def validate(self, data):
        password1 = data.pop('password1')
        password2 = data.pop('password2')

        if password1 != password2:
            raise serializers.ValidationError("Passwords do not match.")

        email = data['email']
        if customUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists.")

        user = customUser.objects.create_user(
            email=email,
            password=password1,
            username=data['username'],
            first_name=data['first_name'],
            last_name=data['last_name'],
        )

        return {'username': user.username, 'email': user.email, 'password': password1, 
                'first_name': user.first_name, 'last_name': user.last_name}



    
class PostSerializer(serializers.ModelSerializer):
    # author = serializers.SlugRelatedField(slug_field='username' ,queryset=User.objects.all())
    creator_id = serializers.ReadOnlyField(source='creator.id')
    image_url = serializers.ImageField(required=False)
    class Meta:
        model = Post
        fields = ['id', 'text', 'image', 'created_at','creator_id', 'image_url']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = customUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'bio')