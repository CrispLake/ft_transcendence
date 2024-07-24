from rest_framework import serializers
from login.models import Account, FriendRequest
from pong.serializers import MatchSerializer
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

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
    online_status = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = ['user', 'online_status']

    def get_online_status(self, obj):
        if timezone.now() - obj.last_activity <= timedelta(minutes=15):
            return "online"
        return "offline"

class AccountSerializer(serializers.ModelSerializer):
    friends = FriendSerializer(many=True, read_only=True)
    user = UserSerializer()

    class Meta:
        model = Account
        fields = ['id', 'user', 'pfp', 'wins', 'losses', 'friends', 'last_activity']
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

class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)

    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'timestamp', 'status']
        read_only_fields = ['from_user', 'timestamp', 'status']
