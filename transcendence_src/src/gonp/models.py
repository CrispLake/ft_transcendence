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

class Gonp_4p(models.Model):
    date = models.DateTimeField(auto_now_add=True)

    player1 = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="gonp_4p_p1", null=True, blank=True)
    player1Score = models.IntegerField(default=0)

    player2 = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="gonp_4p_p2", null=True, blank=True)
    player2Score = models.IntegerField(default=0)

    player3 = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="gonp_4p_p3", null=True, blank=True)
    player3Score = models.IntegerField(default=0)

    player4 = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="gonp_4p_p4", null=True, blank=True)
    player4Score = models.IntegerField(default=0)

    class Meta:
        ordering = ['date']