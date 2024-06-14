from django.db import models
from login.models import Account

class Match(models.Model):
    date = models.DateTimeField()
    winners = models.ManyToManyField(Account, related_name="won_games")
    losers = models.ManyToManyField(Account, related_name="lost_games")

    class Meta:
        ordering = ['date']
