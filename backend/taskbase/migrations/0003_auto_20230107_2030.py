# Generated by Django 3.2.16 on 2023-01-07 17:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taskbase', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='flag',
            field=models.CharField(help_text="По умолчанию флаг оборачивается в 'ctfKpk{}'", max_length=120, verbose_name='Флаг'),
        ),
        migrations.AlterField(
            model_name='teamstasks',
            name='flag',
            field=models.CharField(help_text="По умолчанию флаг оборачивается в 'ctfKpk{}'", max_length=120, verbose_name='Флаг'),
        ),
    ]
