from rest_framework.serializers import ModelSerializer
from quickstart.models import Note, Post, Comment
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from quickstart.models import customUser



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

    def validate(self, data):
        password1 = data.pop('password1')
        password2 = data.pop('password2')

        if password1 != password2:
            raise serializers.ValidationError("Passwords do not match.")

        return data

    def create(self, validated_data):
        password = validated_data.pop('password1')
        user = customUser(**validated_data)
        user.set_password(password)
        user.save()
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