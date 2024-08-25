from django.urls import path
from login import views

urlpatterns  = [
    path('register', views.register),
    path('login', views.CustomAuthToken.as_view()),
    path('csrf-token', views.get_csrf_token),

    path('account/update', views.update_account, name='update-account'),
    path('account/change-username', views.update_user, name='update-user'),
    path('account/change-password', views.change_password, name='change-password'),
    path('account/<int:id>', views.profile),
    path('account/<str:username>', views.profile_from_username),
    path('account', views.profile),
    path('account/<int:id>/image', views.serve_profile_image, name='serve_profile_image'),

    path('friend-request/send', views.send_friend_request, name='send-friend-request'),
    path('friend-request/respond/<int:request_id>', views.respond_to_friend_request, name='respond-to-friend-request'),
    path('friend-request/list', views.request_list),
    path('friend-remove/<int:remove_id>', views.remove_friend),

    path('matchmaking', views.matchmaking),
]