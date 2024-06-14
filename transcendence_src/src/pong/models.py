from django.db import models
from login.models import Account

class Match(models.Model):
    date = models.DateTimeField()
    winners = models.ManyToManyField(Account, related_name="matches")
    losers = models.ManyToManyField(Account, related_name="matches")

    class Meta:
        ordering = ['date']
