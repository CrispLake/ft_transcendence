from rest_framework import serializers
from login.models import Account
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class AccountSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Account
        fields = ['id', 'user', 'pfp', 'wins', 'losses', 'friends']
        extra_kwargs = {
            'friends': {'required': False},
            'pfp': {'required': False}
        }
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        account = Account.objects.create(user=user, **validated_data)
        return account