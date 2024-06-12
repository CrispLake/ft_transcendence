from django.db import models

# Create your models here.

class Match(models.Model):
    winners = models.CharField(max_length=110)
    losers = models.CharField(max_length=110)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date']