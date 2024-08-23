from django.db import models
from login.models import Account

class Gonp_2p(models.Model):
    date = models.DateTimeField(auto_now_add=True)

    player1 = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="gonp_2p_p1", null=True, blank=True)
    player1Score = models.IntegerField(default=0)

    player2 = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="gonp_2p_p2", null=True, blank=True)
    player2Score = models.IntegerField(default=0)

    class Meta:
        ordering = ['date']