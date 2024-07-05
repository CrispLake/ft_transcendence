from django.urls import path
from pong import views

urlpatterns  = [
    path('pong-2p', views.pong_2p),
    path('pong-2p/<int:player_id>', views.pong_2p),
    path('pong-4p', views.pong_4p),
    path('pong-4p/<int:player_id>', views.pong_4p),
]