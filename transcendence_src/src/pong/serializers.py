from rest_framework import serializers
from pong.models import Match, MatchPlayer
from login.models import Account
from login.serializers import SimpleAccountSerializer

class MatchPlayerSerializer(serializers.ModelSerializer):
    account = SimpleAccountSerializer()

    class Meta:
        model = MatchPlayer
        fields = ['account', 'role']

    def create(self, validated_data):
        print("Validated Data in MatchPlayerSerializer.create: ", validated_data)  # Debug log
        account_data = validated_data.pop('account')
        account, created = Account.objects.get_or_create(**account_data)
        match_player = MatchPlayer.objects.create(account=account, **validated_data)
        return match_player

class MatchSerializer(serializers.ModelSerializer):
    # Using this one I can retrieve well formatted data but unable to add
    players = serializers.SerializerMethodField()

    # Using this I can add using {"players": [1, 2]} but cant add role
    # players = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all(), many=True)

    # players = MatchPlayerSerializer()

    class Meta:
        model = Match
        fields = ['id', 'players', 'date']

    def get_players(self, obj):
        match_players = MatchPlayer.objects.filter(match=obj)
        return MatchPlayerSerializer(match_players, many=True).data
    
    def create(self, validated_data):
        print("Initial Data in create method: ", self.initial_data)  # Debug log
        print("Validated Data in create method: ", validated_data)  # Debug log

        if 'players' not in validated_data:
            raise serializers.ValidationError("Players data is missing")

        players_data = validated_data.pop('players')
        match = Match.objects.create(**validated_data)
        
        for player_data in players_data:
            account_data = player_data.pop('account')
            account, created = Account.objects.get_or_create(**account_data)
            MatchPlayer.objects.create(match=match, account=account, **player_data)
        
        return match

    # def validate(self, data):
    #     print("Validating data in MatchSerializer.validate: ", data)  # Debug log
    #     players_data = data.get('players')
    #     if not players_data:
    #         raise serializers.ValidationError("Players data is required")
    #     for player_data in players_data:
    #         account_data = player_data.get('account')
    #         if not account_data:
    #             raise serializers.ValidationError("Each player must include account data")
    #     return data
