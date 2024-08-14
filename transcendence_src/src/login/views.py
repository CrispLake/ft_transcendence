from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from login.models import Account, FriendRequest
from login.serializers import AccountSerializer, UserSerializer, FriendRequestSerializer
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from django.conf import settings
from .decorators import update_last_activity
from django.http import FileResponse
import os

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username
        })

@api_view(['GET'])
@update_last_activity
def serve_profile_image(request, id=None):
    if id is None:
        id = request.user.id

    try:
        account = Account.objects.get(id=id)
        if account.pfp is None or account.pfp.name == '':
            return Response({'detail': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)

        file_path = os.path.join(settings.MEDIA_ROOT, account.pfp.name)

        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'))
        else:
            return Response({'detail': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)
    except Account.DoesNotExist:
        return Response({'detail': 'User doesn\'t exist.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@update_last_activity
def profile(request, id=None):
    if id is None:
        id = request.user.id

    try:
        account = Account.objects.get(id=id)
    except Account.DoesNotExist:
        return Response({'detail': 'User doesn\'t exist.'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = AccountSerializer(account)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@update_last_activity
def profile_from_username(request, username=None):
    if username is None:
        return Response({'detail': 'Impossible request'}, status=status.HTTP_404_NOT_FOUND)

    try:
        account = Account.objects.get(user__username=username)
    except Account.DoesNotExist:
        return Response({'detail': 'User doesn\'t exist.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = AccountSerializer(account)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def register(request):
    if request.method == 'GET':
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required for GET requests.'}, status=status.HTTP_403_FORBIDDEN)
        
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data

        serializer = AccountSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_csrf_token(request):
    token = get_token(request)
    return Response({'csrfToken': token})

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@update_last_activity
def update_account(request):
    image = request.FILES.get('pfp')
    max_size = 2 * 1024 * 1024

    if image is not None and image.size > max_size:
        return Response({'detail': 'File size exceeds 2 MB'}, status=status.HTTP_400_BAD_REQUEST)

    account = request.user.account
    serializer = AccountSerializer(account, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@update_last_activity
def update_user(request):
    user = request.user

    if 'password' in request.data:
        return Response({'detail': 'Use the change password to update password.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@update_last_activity
def change_password(request):
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        user.set_password(serializer.validated_data['password'])
        user.save()

        Token.objects.filter(user=user).delete()

        new_token = Token.objects.create(user=user)

        return Response({'detail': 'password set', 'token': new_token.key}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@update_last_activity
def request_list(request):
    user_id = request.user.id
    requests = FriendRequest.objects.filter(from_user=user_id) | FriendRequest.objects.filter(to_user=user_id)
    serializer = FriendRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@update_last_activity
def send_friend_request(request):
    to_user_id = request.data.get('to_user')

    if to_user_id is request.user.id:
        return Response({'detail': 'Can not send friend request to itself'}, status=status.HTTP_400_BAD_REQUEST)

    if request.user.account.friends.filter(id=to_user_id).exists():
        return Response({'detail': 'Already friend'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        to_user = User.objects.get(id=to_user_id)
    except User.DoesNotExist:
        return Response({'detail': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

    friend_request, created = FriendRequest.objects.get_or_create(from_user=request.user, to_user=to_user)

    if created:
        return Response({'detail': 'friend request sent'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'detail': 'friend request already sent'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@update_last_activity
def respond_to_friend_request(request, request_id):
    try:
        friend_request = FriendRequest.objects.get(id=request_id)
    except FriendRequest.DoesNotExist:
        return Response({'detail': 'friend request doesn\'t exist'}, status=status.HTTP_404_NOT_FOUND)

    if friend_request.to_user != request.user:
        return Response({'detail': 'not authorized'}, status=status.HTTP_403_FORBIDDEN)

    if request.data.get('accept'):
        request.user.account.friends.add(friend_request.from_user.account)
        friend_request.from_user.account.friends.add(request.user.account)
        friend_request.delete()
        return Response({'detail': 'friend request accepted'}, status=status.HTTP_200_OK)
    else:
        friend_request.delete()
        return Response({'detail': 'friend request rejected'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@update_last_activity
def remove_friend(request, remove_id):
    try:
        to_remove = User.objects.get(id=remove_id)
    except User.DoesNotExist:
        return Response({'detail': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

    user_account = request.user.account
    to_remove_account = to_remove.account

    if not user_account.friends.filter(id=remove_id).exists():
        return Response({'detail': 'This user is not in your friends list'}, status=status.HTTP_400_BAD_REQUEST)

    user_account.friends.remove(to_remove_account)
    to_remove_account.friends.remove(user_account)

    return Response({'detail': 'friend removed'}, status=status.HTTP_200_OK)