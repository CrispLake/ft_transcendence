from rest_framework import serializers
from pong.models import Match, MatchPlayer
from login.models import Account
from login.serializers import SimpleAccountSerializer

class MatchPlayerSerializer(serializers.ModelSerializer):
    account = SimpleAccountSerializer()

    class Meta:
        model = MatchPlayer
        fields = ['account', 'role']

class MatchSerializer(serializers.ModelSerializer):
    players = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = ['id', 'players', 'date']
    
    def get_players(self, obj):
        match_players = MatchPlayer.objects.filter(match=obj)
        return MatchPlayerSerializer(match_players, many=True).data
