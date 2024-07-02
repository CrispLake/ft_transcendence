from django.urls import path
from login import views

urlpatterns  = [
    path('register', views.register),
    path('login', views.CustomAuthToken.as_view()),
    path('csrf-token', views.get_csrf_token),
    path('account/update', views.update_account, name='update-account'),
    path('user/change-username', views.update_user, name='update-user'),
    path('user/change-password', views.change_password, name='change-password'),
    path('friend-request/send', views.send_friend_request, name='send-friend-request'),
    path('friend-request/respond/<int:request_id>', views.respond_to_friend_request, name='respond-to-friend-request'),
    path('friend-request/list', views.request_list),
    path('friend-remove/<int:remove_id>', views.remove_friend)
]