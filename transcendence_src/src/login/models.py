from django.db import models

# Create your models here.

# class password(models.Model):
#     password = models.CharField(max_length=50)
#     user = models.ForeignKey("login.User", related_name="passwd")

# class User(models.Model):
#     username = models.CharField(max_length=50)
#     pfp = models.ImageField()
#     wins = models.IntegerField()
#     losses = models.IntegerField()
#     sessionid?
#     gamehistory?

# stats
# pfp
class User(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
