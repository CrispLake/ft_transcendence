from rest_framework import serializers
from .models import Tournament

class TournamentSerializer(serializers.ModelSerializer):
    game1_player1_username = serializers.SerializerMethodField()
    game1_player2_username = serializers.SerializerMethodField()
    game2_player1_username = serializers.SerializerMethodField()
    game2_player2_username = serializers.SerializerMethodField()
    game3_player1_username = serializers.SerializerMethodField()
    game3_player2_username = serializers.SerializerMethodField()

    class Meta:
        model = Tournament
        fields = ['id',
                'game1_player1', 'game1_player1_username', 'game1_player1_score',
                'game1_player2', 'game1_player2_username', 'game1_player2_score',
                'game2_player1', 'game2_player1_username', 'game2_player1_score',
                'game2_player2', 'game2_player2_username', 'game2_player2_score',
                'game3_player1', 'game3_player1_username', 'game3_player1_score',
                'game3_player2', 'game3_player2_username', 'game3_player2_score',
                'date']

    def get_game1_player1_username(self, obj):
        if not obj.game1_player1:
            return 'Guest'
        return obj.game1_player1.user.username

    def get_game1_player2_username(self, obj):
        if not obj.game1_player2:
            return 'Guest'
        return obj.game1_player2.user.username
    
    def get_game2_player1_username(self, obj):
        if not obj.game2_player1:
            return 'Guest'
        return obj.game2_player1.user.username

    def get_game2_player2_username(self, obj):
        if not obj.game2_player2:
            return 'Guest'
        return obj.game2_player2.user.username

    def get_game3_player1_username(self, obj):
        if not obj.game3_player1:
            return 'Guest'
        return obj.game3_player1.user.username

    def get_game3_player2_username(self, obj):
        if not obj.game3_player2:
            return 'Guest'
        return obj.game3_player2.user.username