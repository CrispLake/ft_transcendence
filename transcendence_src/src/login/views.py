from django.shortcuts import render
from django.http import HttpResponse, Http404
from .models import User

# TODO create validates
def validate_username(username):
    return True

def validate_password(password):
    return True

def register(request):
    username = request.POST.get('username', '')
    if validate_username(username) == False:
        return HttpResponse(status=501) # TODO return correct error

    password = request.POST.get('password', '')
    if validate_password(password) == False:
        return HttpResponse(status=501) # TODO return correct error

    User.objects.create(username=username, password=password)
    return HttpResponse(status=201)

def login(request):
    username = request.POST.get('username', '')
    if User.objects.filter(username=username).exists() == False:
        return HttpResponse(status=501) # TODO incorrect username/password

    password = request.POST.get('password', '')
    if User.objects.get(username=username).password != password:
        return HttpResponse(status=501) # TODO incorrect username/password

    return HttpResponse(status=201)