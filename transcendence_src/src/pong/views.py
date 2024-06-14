from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from pong.models import Match
from pong.serializers import MatchSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def match(request):
    if request.method == 'GET':
        matches = Match.objects.all()
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)