from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from pong.authentication import MultiTokenAuthentication
from .models import Gonp_4p, Gonp_2p
from .serializers import Gonp2PSerializer, Gonp4PSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([MultiTokenAuthentication])
def gonp_2p(request, player_id=None):
    if request.method == 'GET':
        if player_id is not None:
            matches = Gonp_2p.objects.filter(player1_id=player_id) | Gonp_2p.objects.filter(player2_id=player_id)
        else:
            matches = Gonp_2p.objects.all()

        serializer = Gonp2PSerializer(matches, many=True)
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

        serializer = Gonp2PSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def check_unique_ids(a, b, c, d):
    ids = [a, b, c, d]
    non_none_ids = [id for id in ids if id is not None]
    return len(non_none_ids) == len(set(non_none_ids))

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([MultiTokenAuthentication])
def gonp_4p(request, player_id=None):
    if request.method == 'GET':
        if player_id is not None:
            matches = Gonp_4p.objects.filter(player1_id=player_id) | Gonp_4p.objects.filter(player2_id=player_id) | Gonp_4p.objects.filter(player3_id=player_id) | Gonp_4p.objects.filter(player4_id=player_id)
        else:
            matches = Gonp_4p.objects.all()

        serializer = Gonp4PSerializer(matches, many=True)
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

        serializer = Gonp4PSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)