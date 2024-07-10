from django.urls import path
from gonp import views

urlpatterns  = [
    path('gonp-2p', views.gonp_2p),
    path('gonp-2p/<int:player_id>', views.gonp_2p),
    path('gonp-4p', views.gonp_4p),
    path('gonp-4p/<int:player_id>', views.gonp_4p),
]