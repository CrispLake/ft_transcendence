from rest_framework import serializers
from pong.models import Match

class MatchSerializer(serializers.ModelSerializer):
    player1_username = serializers.SerializerMethodField()
    player2_username = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = ['id', 'player1', 'player1_username', 'player1Score', 'player2', 'player2_username', 'player2Score', 'date']

    def get_player1_username(self, obj):
        if not obj.player1:
            return "Guest"
        return obj.player1.user.username

    def get_player2_username(self, obj):
        if not obj.player2:
            return "Guest"
        return obj.player2.user.username