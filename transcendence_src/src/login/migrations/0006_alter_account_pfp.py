# Generated by Django 5.0.7 on 2024-07-25 09:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0005_account_last_activity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='pfp',
            field=models.ImageField(default='/login/profile_pics/pfp.png', upload_to='login/profile_pics/'),
        ),
    ]
