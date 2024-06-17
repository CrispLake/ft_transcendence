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
    # Using this one I can retrieve well formatted data but unable to add
    players = serializers.SerializerMethodField()

    # Using this I can add using {"players": [1, 2]} but cant add role
    # players = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all(), many=True)

    class Meta:
        model = Match
        fields = ['id', 'players', 'date']
    
    def get_players(self, obj):
        match_players = MatchPlayer.objects.filter(match=obj)
        return MatchPlayerSerializer(match_players, many=True).data