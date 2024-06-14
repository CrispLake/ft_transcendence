from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from pong.models import Match
from pong.serializers import MatchSerializer

@api_view(['GET'])
def match(request):
    if request.method == 'GET':
        matches = Match.objects.all()
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)