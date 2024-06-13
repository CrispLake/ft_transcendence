from django.urls import path
from login import views

urlpatterns  = [
    path('register', views.register),
    path('login', views.CustomAuthToken.as_view()),
]