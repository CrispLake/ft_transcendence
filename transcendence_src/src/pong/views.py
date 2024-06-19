from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from pong.models import Match
from pong.serializers import MatchSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def match(request):
    if request.method == 'GET':
        matches = Match.objects.all()
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # print(request.data)
        serializer = MatchSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            # print(f'initial: ', serializer.initial_data)
            # print(f'serializer_data: ', serializer.data)
            # print('end')
            # serializer.data = data
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)