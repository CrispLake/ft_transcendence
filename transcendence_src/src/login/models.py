from django.db import models

# Create your models here.

# stats
# pfp
class User(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
