# Generated by Django 4.2.2 on 2023-08-03 14:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='monthlyperiod',
            name='from_date',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='monthlyperiod',
            name='to_date',
            field=models.DateField(null=True),
        ),
    ]
