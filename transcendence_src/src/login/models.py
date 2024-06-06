from django.db import models

# Create your models here.

class User(models.Model):
    username = models.charField(max_length=100)
    password = models.charField(max_length=100)