from rest_framework import serializers
from .models import Gonp_2p

class Gonp2PSerializer(serializers.ModelSerializer):
    player1Username = serializers.SerializerMethodField()
    player2Username = serializers.SerializerMethodField()

    class Meta:
        model = Gonp_2p
        fields = ['id',
                'player1', 'player1Username', 'player1Score',
                'player2', 'player2Username', 'player2Score',
                'date']

    def get_player1Username(self, obj):
        if not obj.player1:
            return "Guest"
        return obj.player1.user.username

    def get_player2Username(self, obj):
        if not obj.player2:
            return "Guest"
        return obj.player2.user.username