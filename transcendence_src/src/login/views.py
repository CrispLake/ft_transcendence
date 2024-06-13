from django.shortcuts import render
from django.http import HttpResponse, Http404
from django.contrib.auth.models import User
import PIL.Image

# TODO create validates
def validate_username(username):
    return True

def validate_password(password):
    return True

def register(request):
    if request.method == "GET":
        return render(request, "user/register.html") # TODO remove or make it
    elif request.method == "POST":
        username = request.POST.get('username', '')
        if validate_username(username) == False:
            return HttpResponse(status=501) # TODO return correct error

        password = request.POST.get('password', '')
        if validate_password(password) == False:
            return HttpResponse(status=501) # TODO return correct error
        
        user = User.objects.create(username, "", password) # empty string to put empty email for user
        user.account.wins = 0
        user.account.losses = 0
        user.account.pfp = PIL.Image.open(r'./defaultpfp.png')
        user.save()
        return HttpResponse(status=201)

# def login(request):
#     username = request.POST.get('username', '')
#     if User.objects.filter(username=username).exists() == False:
#         return HttpResponse(status=501) # TODO incorrect username/password

#     password = request.POST.get('password', '')
#     if User.objects.get(username=username).password != password:
#         return HttpResponse(status=501) # TODO incorrect username/password

#     return HttpResponse(status=201)

def password_change(request):
    user = User.objects.get(username=request.POST.get('username'))
    user.set_password(request.POST.get('password'))
    user.save()