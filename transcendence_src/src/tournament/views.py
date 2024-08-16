from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.db.models import F
from pong.authentication import MultiTokenAuthentication
from login.models import Account
from login.decorators import update_last_activity
from .models import Tournament
from .serializers import TournamentSerializer

def update_score(player_id, my_score):
    if player_id is not None:
        player = Account.objects.get(id=player_id)
        if my_score != 0:
            player.wins = F('wins') + 1
        else:
            player.losses = F('losses') + 1
        player.save()

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([MultiTokenAuthentication])
@update_last_activity
def tournament(request, player_id=None):
    if request.method == 'GET':
        if player_id is None:
            player_id = request.user.id
        matches = Tournament.objects.filter(game1_player1=player_id) | Tournament.objects.filter(game1_player2=player_id) | Tournament.objects.filter(game2_player1=player_id) | Tournament.objects.filter(game2_player2=player_id) | Tournament.objects.filter(game3_player1=player_id) | Tournament.objects.filter(game3_player2=player_id)

        serializer = TournamentSerializer(matches, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        game1_player1 = request.data.get('game1_player1')
        game1_player2 = request.data.get('game1_player2')

        game2_player1 = request.data.get('game2_player1')
        game2_player2 = request.data.get('game2_player2')

        game3_player1 = request.data.get('game3_player1')
        game3_player2 = request.data.get('game3_player2')

        tokens = [token.strip() for token in request.headers.get('Authorization', '').replace('Token ', '').split(',')]
        valid_user_ids = [user.id for user in User.objects.filter(auth_token__key__in=tokens)]

        if game1_player1 is not None and game1_player1 != 1:
            if game1_player1 not in valid_user_ids:
                return Response({'detail': 'Invalid player ID or unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        if game1_player2 is not None and game1_player2 != 1:
            if game1_player2 not in valid_user_ids:
                return Response({'detail': 'Invalid player ID or unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        if game2_player1 is not None and game2_player1 != 1:
            if game2_player1 not in valid_user_ids:
                return Response({'detail': 'Invalid player ID or unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        if game2_player2 is not None and game2_player2 != 1:
            if game2_player2 not in valid_user_ids:
                return Response({'detail': 'Invalid player ID or unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        if game3_player1 is not None and game3_player1 != 1:
            if game3_player1 not in valid_user_ids:
                return Response({'detail': 'Invalid player ID or unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        if game3_player2 is not None and game3_player2 != 1:
            if game3_player2 not in valid_user_ids:
                return Response({'detail': 'Invalid player ID or unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = TournamentSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            game1_player1_score = serializer.data['game1_player1_score']
            game1_player2_score = serializer.data['game1_player2_score']

            game2_player1_score = serializer.data['game2_player1_score']
            game2_player2_score = serializer.data['game2_player2_score']

            game3_player1_score = serializer.data['game3_player1_score']
            game3_player2_score = serializer.data['game3_player2_score']

            update_score(game1_player1, game1_player1_score)
            update_score(game1_player2, game1_player2_score)

            update_score(game2_player1, game2_player1_score)
            update_score(game2_player2, game2_player2_score)

            update_score(game3_player1, game3_player1_score)
            update_score(game3_player2, game3_player2_score)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)