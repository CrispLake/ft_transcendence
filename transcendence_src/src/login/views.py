from django.shortcuts import render
from django.http import HttpResponse, Http404
from login.models import User

# Create your views here.
# def index(request):
#     return render(request, "singlepage/index.html")

# def section(request, num):
#     if 1 <= num <= 3:
#         return HttpResponse(texts[num-1])
#     else:
#         raise Http404("No such section")

# def test_add(request):
#     text = request.GET.get('text', 'hello')  # Default to 'hello' if no text provided
#     Test.objects.create(text=text)
#     return HttpResponse(status=201)


# def test_display(request):
#     tests = Test.objects.all().values('text')
#     tests_list = list(tests)

#     html_content = "<ul>"
#     for test in tests_list:
#         html_content += f"<li>{test['text']}</li>"
#     html_content += "</ul>"

#     return HttpResponse(html_content)


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

def sign_in(request):
    username = request.POST.get('username', '')
    if User.objects.filter(username=username).exists() == False:
        return HttpResponse(status=501) # TODO incorrect username/password

    password = request.POST.get('password', '')
    if User.objects.get(username=username).password != password:
        return HttpResponse(status=501) # TODO incorrect username/password

    return HttpResponse(status=201)