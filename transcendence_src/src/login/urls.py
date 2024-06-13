from django.urls import path
from login import views
from rest_framework.authtoken import views as authtoken_views



urlpatterns  = [
    path('register', views.register),
    path('login', authtoken_views.obtain_auth_token),
]