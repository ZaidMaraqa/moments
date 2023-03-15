from rest_framework.serializers import ModelSerializer
from quickstart.models import Note, Post, Comment
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from quickstart.models import customUser
from django.core.exceptions import ValidationError


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['id'] = user.id
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

    def validate_email(self, value):
        if customUser.objects.filter(email=value).exists():
            raise ValidationError("Email already exists.")
        return value

    def validate(self, data):
        password1 = data.pop('password1')
        password2 = data.pop('password2')

        if password1 != password2:
            raise serializers.ValidationError("Passwords do not match.")
        
        data['password'] = password1
        return data

    def create(self, validated_data):
        user = customUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        return user

     

class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = customUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'bio')

class FollowingSerializer(serializers.ModelSerializer):
    class Meta:
        model = customUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'bio')


class UserSerializer(serializers.ModelSerializer):
    followers = FollowerSerializer(many=True, read_only=True)
    following = FollowingSerializer(many=True, read_only=True)
    class Meta:
        model = customUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'bio', 'followers', 'following')

    def get_followers(self, obj):
        followers = obj.followers.all()
        return UserSerializer(followers, many=True).data

    def get_following(self, obj):
        following = obj.following.all()
        return UserSerializer(following, many=True).data
    
    # def get_is_following(self, obj):
    #     user = self.context['request'].user
    #     return user.following.filter(id=obj.id).exists()


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ('id', 'user', 'post', 'comment_text', 'created_at', 'updated_at')

class PostSerializer(serializers.ModelSerializer):
    # author = serializers.SlugRelatedField(slug_field='username' ,queryset=User.objects.all())
    user = UserSerializer(read_only=True)
    image_url = serializers.ImageField(required=False)
    comments = CommentSerializer(many=True, read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'text', 'image', 'created_at','user', 'image_url', 'likes', 'comments']