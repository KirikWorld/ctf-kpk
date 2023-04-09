# Generated by Django 3.2.16 on 2023-04-03 11:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_user_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='teams',
            name='invintation',
            field=models.CharField(default='614dbb478461a8aaaa1d', max_length=250, unique=True, verbose_name='Токен приглашения'),
        ),
        migrations.AddField(
            model_name='teams',
            name='max_members',
            field=models.IntegerField(default=5, verbose_name='Максимальное кол-во участников'),
            preserve_default=False,
        ),
    ]
