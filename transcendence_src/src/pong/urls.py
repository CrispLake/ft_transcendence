from django.urls import path
from pong import views

urlpatterns  = [
    path('match', views.match),
]