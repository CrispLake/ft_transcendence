from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from pong.models import Match
from pong.serializers import MatchSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def match(request, player_id=None):

    if request.method == 'GET':
        if player_id is not None:
            matches = Match.objects.filter(player1_id=player_id) | Match.objects.filter(player2_id=player_id)
        else:
            matches = Match.objects.all()

        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':

        player1_id = request.data.get('player1')
        player2_id = request.data.get('player2')

        if player1_id == player2_id:
            return Response({'detail': 'Cannot create a match with same player multiple times'})

        if request.user.id !=  player1_id and request.user.id != player2_id:
            return Response({'detail': 'You do not have permissions to create this match'})

        serializer = MatchSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)