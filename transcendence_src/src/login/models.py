from django.db import models

# Create your models here.

class Match(models.Model):
    winners = models.CharField(max_length=110)
    losers = models.CharField(max_length=110)
    date = models.DateTimeField()

class User(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    pfp = models.ImageField()
    wins = models.IntegerField()
    losses = models.IntegerField()
    # sessionid = models.CharField
    # gamehistory?
    # friends