from django.urls import path
from pong import views

urlpatterns = [
    path('matches/', views.match_list),
]
