from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.db.models import F
from .authentication import MultiTokenAuthentication
from pong.models import Match, Pong_4p
from login.models import Account
from pong.serializers import MatchSerializer, Pong4PSerializer

def update_2p_score(player_id, my_score, other_score):
    if player_id is not None:
        player = Account.objects.get(id=player_id)
        if my_score > other_score:
            player.wins = F('wins') + 1
        else:
            player.losses = F('losses') + 1
        player.save()

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([MultiTokenAuthentication])
def pong_2p(request, player_id=None):
    if request.method == 'GET':
        if player_id == None:
            player_id = request.user.id
        matches = Match.objects.filter(player1_id=player_id) | Match.objects.filter(player2_id=player_id)

        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        player1_id = request.data.get('player1')
        player2_id = request.data.get('player2')

        if player1_id is None:
            return Response({'detail': 'Player ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if player1_id is player2_id:
            return Response({'detail': 'Player IDs can not be same'}, status=status.HTTP_400_BAD_REQUEST)

        tokens = [token.strip() for token in request.headers.get('Authorization', '').replace('Token ', '').split(',')]
        valid_user_ids = [user.id for user in User.objects.filter(auth_token__key__in=tokens)]

        if player1_id not in valid_user_ids:
            return Response({'detail': 'Invalid player ID or unauthorized.'}, status=status.HTTP_403_FORBIDDEN)
        if player2_id is not None:
            if player2_id not in valid_user_ids:
                return Response({'detail': 'Invalid player ID or unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = MatchSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            player1_score = serializer.data['player1Score']
            player2_score = serializer.data['player2Score']

            update_2p_score(player1_id, player1_score, player2_score)
            update_2p_score(player2_id, player2_score, player1_score)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def check_unique_ids(a, b, c, d):
    ids = [a, b, c, d]
    non_none_ids = [id for id in ids if id is not None]
    return len(non_none_ids) == len(set(non_none_ids))

def update_4p_score(player_id, my_score):
    if player_id is not None:
        player = Account.objects.get(id=player_id)
        # checking if health is not 0 we won
        if my_score is not 0:
            player.wins = F('wins') + 1
        else:
            player.losses = F('losses') + 1
        player.save() 

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([MultiTokenAuthentication])
def pong_4p(request, player_id=None):
    if request.method == 'GET':
        if player_id is None:
            player_id = request.player.id
        matches = Pong_4p.objects.filter(player1_id=player_id) | Pong_4p.objects.filter(player2_id=player_id) | Pong_4p.objects.filter(player3_id=player_id) | Pong_4p.objects.filter(player4_id=player_id)

        serializer = Pong4PSerializer(matches, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        player1_id = request.data.get('player1')
        player2_id = request.data.get('player2')
        player3_id = request.data.get('player3')
        player4_id = request.data.get('player4')

        if player1_id is None:
            return Response({'detail': 'Player ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if check_unique_ids(player1_id, player2_id, player3_id, player4_id) is False:
            return Response({'detail': 'Player IDs can not be same'}, status=status.HTTP_400_BAD_REQUEST)

        tokens = [token.strip() for token in request.headers.get('Authorization', '').replace('Token ', '').split(',')]
        valid_user_ids = [user.id for user in User.objects.filter(auth_token__key__in=tokens)]

        if player1_id not in valid_user_ids:
            return Response({'detail': 'Invalid player ID or unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        if player2_id is not None:
            if player2_id not in valid_user_ids:
                return Response({'detail': 'Invalid player ID or unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        if player3_id is not None:
            if player3_id not in valid_user_ids:
                return Response({'detail': 'Invalid player ID or unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        if player4_id is not None:
            if player4_id not in valid_user_ids:
                return Response({'detail': 'Invalid player ID or unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = Pong4PSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            player1_score = serializer.data['player1Score']
            player2_score = serializer.data['player2Score']
            player3_score = serializer.data['player3Score']
            player4_score = serializer.data['player4Score']

            update_4p_score(player1_id, player1_score)
            update_4p_score(player2_id, player2_score)
            update_4p_score(player3_id, player3_score)
            update_4p_score(player4_id, player4_score)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
