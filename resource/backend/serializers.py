from rest_framework import serializers
from .models import Score
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your models here.
class UserSerializer(serializers.ModelSerializer):
    class Meta :
        model = User 
        fields = ['username']



class ScoreSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Score
        fields = ('user', 'points')
