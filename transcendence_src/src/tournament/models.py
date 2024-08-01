from django.db import models
from login.models import Account

class Tournament(models.Model):
    date = models.DateTimeField(auto_now_add=True)

    game1_player1 = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="tournament_game1_player1", null=True, blank=True)
    game1_player2 = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="tournament_game1_player2", null=True, blank=True)
    game1_player1_score = models.IntegerField(default=0)
    game1_player2_score = models.IntegerField(default=0)

    game2_player1 = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="tournament_game2_player1", null=True, blank=True)
    game2_player2 = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="tournament_game2_player2", null=True, blank=True)
    game2_player1_score = models.IntegerField(default=0)
    game2_player2_score = models.IntegerField(default=0)

    game3_player1 = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="tournament_game3_player1", null=True, blank=True)
    game3_player2 = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="tournament_game3_player2", null=True, blank=True)
    game3_player1_score = models.IntegerField(default=0)
    game3_player2_score = models.IntegerField(default=0)