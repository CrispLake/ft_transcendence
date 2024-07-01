from rest_framework import serializers
from login.models import Account
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
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
        fields = ['id', 'user', 'pfp', 'wins', 'losses', 'friends', 'matches_as_player1', 'matches_as_player2']
        extra_kwargs = {
            'friends': {'required': False},
            'pfp': {'required': False},
            'matches_as_player1': {'required': False},
            'matches_as_player2': {'required': False},
        }
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        # pfp_data = validated_data.pop('pfp', None)

        user_serializer = UserSerializer(data=user_data)
        
        if user_serializer.is_valid():
            user = user_serializer.save()
            account = Account.objects.create(user=user, **validated_data)

            # if pfp_data:
            #     account.pfp = self.handle_base64_pfp(pfp_data, user.username)
            #     account.save

            return account

        
        else:
            raise serializers.ValidationError(user_serializer.errors)