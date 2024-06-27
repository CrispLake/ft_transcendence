from django.test import TestCase
from .models import User

# Create your tests here.

class UsernameTests(TestCase):
    def test_username_exists(self):
        User.objects.create(username='TestUser', password='abc')
        self.assertIs(User.objects.filter(username='TestUser').exists(), True)
