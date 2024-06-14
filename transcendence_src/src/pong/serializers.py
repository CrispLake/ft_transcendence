from rest_framework import serializers
from pong.models import Match, MatchPlayer
from login.models import Account
from login.serializers import AccountSerializer

class MatchSerializer(serializers.ModelSerializer):
    players = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all(), many=True)

    class Meta:
        model = Match
        fields = ['players', 'date']
    
    def get_players(self, obj):
        match_players = MatchPlayer.objects.filter(match=obj)
        return MatchPlayerSerializer(match_players, many=True).data

class MatchPlayerSerializer(serializers.ModelSerializer):
    account = AccountSerializer()

    class Meta:
        model = MatchPlayer
        fields = ['account', 'role']
