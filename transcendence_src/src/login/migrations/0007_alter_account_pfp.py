# Generated by Django 5.1 on 2024-08-22 10:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0006_alter_account_pfp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='pfp',
            field=models.ImageField(default='login/profile_pics/pfp.png', upload_to='login/profile_pics/'),
        ),
    ]
