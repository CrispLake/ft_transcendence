from django.db import models
from login.models import Account

class Match(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    players = models.ManyToManyField(Account, through='MatchPlayer', related_name="matches")

    class Meta:
        ordering = ['date']

class MatchPlayer(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    role = models.CharField(max_length=15)
