import sys
from django.conf import settings
from django.core.wsgi import get_wsgi_application
from django.http import HttpResponse
from django.urls import path

settings.configure(
    DEBUG=True,
    SECRET_KEY = 'abcd',
    ALLOWED_HOSTS=['*'],
    ROOT_URLCONF=__name__,
)

def home_view(request, *args, **kwargs):
    return HttpResponse("<h1>Hello World!</h1>")

urlpatterns = [
    path("", home_view)
]

application = get_wsgi_application()

if __name__ == "__main__":
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django"
        ) from exc
    execute_from_command_line(sys.argv)