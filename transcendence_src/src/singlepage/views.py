from django.shortcuts import render
from django.http import HttpResponse, Http404
from singlepage.models import Test

# Create your views here.
def index(request):
    return render(request, "singlepage/index.html")


texts = ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tortor mauris, maximus semper volutpat vitae, varius placerat dui. Nunc consequat dictum est, at vestibulum est hendrerit at. Mauris suscipit neque ultrices nisl interdum accumsan. Sed euismod, ligula eget tristique semper, lecleo mi nec orci. Curabitur hendrerit, est in ",
        "Praesent euismod auctor quam, id congue tellus malesuada vitae. Ut sed lacinia quam. Sed vitae mattis metus, vel gravida ante. Praesent tincidunt nulla non sapien tincidunt, vitae semper diam faucibus. Nulla venenatis tincidunt efficitur. Integer justo nunc, egestas eget dignissim dignissim,  facilisis, dictum nunc ut, tincidunt diam.",
        "Morbi imperdiet nunc ac quam hendrerit faucibus. Morbi viverra justo est, ut bibendum lacus vehicula at. Fusce eget risus arcu. Quisque dictum porttitor nisl, eget condimentum leo mollis sed. Proin justo nisl, lacinia id erat in, suscipit ultrices nisi. Suspendisse placerat nulla at volutpat ultricies"]

def section(request, num):
    if 1 <= num <= 3:
        return HttpResponse(texts[num-1])
    else:
        raise Http404("No such section")

def test_add(request):
    text = request.GET.get('text', 'hello')  # Default to 'hello' if no text provided
    Test.objects.create(text=text)
    return HttpResponse(status=201)


def test_display(request):
    tests = Test.objects.all().values('text')
    tests_list = list(tests)

    html_content = "<ul>"
    for test in tests_list:
        html_content += f"<li>{test['text']}</li>"
    html_content += "</ul>"

    return HttpResponse(html_content)

