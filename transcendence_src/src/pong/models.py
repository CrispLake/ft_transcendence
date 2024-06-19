from django.db import models
from login.models import Account

class Match(models.Model):
    date = models.DateTimeField(auto_now_add=True)

    player1 = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="matches_as_player1")
    player1Score = models.IntegerField(default=0)

    player2 = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="matches_as_player2")
    player2Score = models.IntegerField(default=0)

    class Meta:
        ordering = ['date']