from rest_framework import serializers
from pong.models import Match

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['winners', 'losers', 'date']