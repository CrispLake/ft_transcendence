from django.urls import path
from login import views

urlpatterns  = [
    path('register', views.register),
    path('login', views.CustomAuthToken.as_view()),
    path('csrf-token', views.get_csrf_token),
    path('account/update', views.update_account, name='update-account'),
    path('user/update', views.update_user, name='update-user'),
    path('user/change-password', views.change_password, name='change-password'),
]