from rest_framework import serializers
from login.models import Account, FriendRequest
from pong.serializers import MatchSerializer
from django.contrib.auth.models import User

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'timestamp', 'status']
        read_only_fields = ['from_user', 'timestamp', 'status']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class FriendSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Account
        fields = ['user']


class AccountSerializer(serializers.ModelSerializer):
    friends = FriendSerializer(many=True, read_only=True)
    user = UserSerializer()

    class Meta:
        model = Account
        fields = ['id', 'user', 'pfp', 'wins', 'losses', 'friends']
        extra_kwargs = {
            'friends': {'required': False},
            'pfp': {'required': False},
        }

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_serializer = UserSerializer(data=user_data)
        
        if user_serializer.is_valid():
            user = user_serializer.save()
            account = Account.objects.create(user=user, **validated_data)
            return account

        else:
            raise serializers.ValidationError(user_serializer.errors)