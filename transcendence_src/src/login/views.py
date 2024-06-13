from PIL import Image
from io import BytesIO
import base64
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from login.models import Account
from login.serializers import AccountSerializer


@api_view(['GET', 'PUT', 'POST'])
def register(request):
    if request.method == "GET":
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        data = request.data
        # with open('login/static/images/pfp.png', 'rb') as img_file:
        #     img = Image.open(img_file)
        #     buffered = BytesIO()
        #     img.save(buffered, format="PNG")
        #     img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
        #     data['pfp'] = img_str

        serializer = AccountSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        print('Data: ', serializer.initial_data)
        print('errors: ', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        return Response(status=status.HTTP_201_CREATED)

# def login(request):
#     username = request.POST.get('username', '')
#     if User.objects.filter(username=username).exists() == False:
#         return HttpResponse(status=501) # TODO incorrect username/password

#     password = request.POST.get('password', '')
#     if User.objects.get(username=username).password != password:
#         return HttpResponse(status=501) # TODO incorrect username/password

#     return HttpResponse(status=201)