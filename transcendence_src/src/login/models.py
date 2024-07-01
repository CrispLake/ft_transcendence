from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


# Create your models here.

# class Match(models.Model):
#     winners = models.CharField(max_length=110)
#     losers = models.CharField(max_length=110)
#     date = models.DateTimeField()

class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    pfp = models.ImageField(upload_to='login/profile_pics/')
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    friends = models.ManyToManyField("self", blank=True)
    # games = models.ManyToManyField(Match)
    # status = models.BooleanField()
    # gamehistory?
    # online_status?

    class Meta:
        ordering = ['user']

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
