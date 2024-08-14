from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import User
import os

@receiver(post_migrate)
def create_default_account(sender, **kwargs):
    from login.models import Account
    default_username = 'AI'
    if not User.objects.filter(username=default_username).exists():
        default_user = User.objects.create_user(username=default_username, password=os.environ['AI_PASSWORD'])
        Account.objects.create(user=default_user)
