# Generated by Django 5.0.7 on 2024-07-26 19:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('login', '0006_alter_account_pfp'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('game1_player1_score', models.IntegerField(default=0)),
                ('game1_player2_score', models.IntegerField(default=0)),
                ('game2_player1_score', models.IntegerField(default=0)),
                ('game2_player2_score', models.IntegerField(default=0)),
                ('game3_player1_score', models.IntegerField(default=0)),
                ('game3_player2_score', models.IntegerField(default=0)),
                ('game1_player1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tournament_game1_player1', to='login.account')),
                ('game1_player2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tournament_game1_player2', to='login.account')),
                ('game2_player1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tournament_game2_player1', to='login.account')),
                ('game2_player2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tournament_game2_player2', to='login.account')),
                ('game3_player1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tournament_game3_player1', to='login.account')),
                ('game3_player2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tournament_game3_player2', to='login.account')),
            ],
        ),
    ]