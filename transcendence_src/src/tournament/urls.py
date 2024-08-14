from django.urls import path
from tournament import views

urlpatterns  = [
    path('tournament', views.tournament),
    path('tournament/<int:player_id>', views.tournament),
]