# Generated by Django 5.0.7 on 2024-07-23 12:50

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0004_alter_account_options_friendrequest'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='last_activity',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
