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

        if request.user.id != player1_id and request.user.id != player2_id:
            return Response({'detail': 'You do not have permissions to create this match'})

        serializer = MatchSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# TODO decide if we want authentication for each user participating in the match or not
# # authentication.py
# from rest_framework.authentication import TokenAuthentication
# from rest_framework.exceptions import AuthenticationFailed

# class MultiTokenAuthentication(TokenAuthentication):
#     def authenticate(self, request):
#         tokens = request.headers.get('Authorization', '').split(',')
#         if not tokens:
#             return None

#         for token in tokens:
#             token = token.strip().split(' ')[1]
#             if not token:
#                 continue
#             try:
#                 user, _ = self.authenticate_credentials(token)
#                 return (user, token)
#             except AuthenticationFailed:
#                 continue
#         return None

# @api_view(['GET', 'POST'])
# @permission_classes([IsAuthenticated])
# @authentication_classes([MultiTokenAuthentication])
# def match(request, player_id=None):
#     if request.method == 'GET':
#         if player_id is not None:
#             # Check if the authenticated user's ID matches the player_id
#             if request.user.id != player_id:
#                 return Response({'detail': 'You do not have permission to view these matches.'}, status=status.HTTP_403_FORBIDDEN)

#             matches = Match.objects.filter(player1_id=player_id) | Match.objects.filter(player2_id=player_id)
#         else:
#             matches = Match.objects.all()

#         serializer = MatchSerializer(matches, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         player1_id = request.data.get('player1')
#         player2_id = request.data.get('player2')

#         if player1_id is None or player2_id is None:
#             return Response({'detail': 'Player IDs are required.'}, status=status.HTTP_400_BAD_REQUEST)

#         # Check if player1_id and player2_id are valid and match the auth tokens
#         valid_user_ids = [user.id for user in User.objects.filter(auth_token__key__in=request.headers.get('Authorization', '').replace('Token ', '').split(','))]

#         if player1_id not in valid_user_ids or player2_id not in valid_user_ids:
#             return Response({'detail': 'Invalid player ID or unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

#         serializer = MatchSerializer(data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
