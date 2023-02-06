from rest_framework.serializers import ModelSerializer
from quickstart.models import Note
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


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