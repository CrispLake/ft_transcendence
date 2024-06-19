from django.urls import path
from pong import views

urlpatterns  = [
    path('match', views.match, name='match-list'),
    path('match/<int:player_id>', views.match, name='player-matches'),
]