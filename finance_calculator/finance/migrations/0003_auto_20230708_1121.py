# Generated by Django 4.2.2 on 2023-07-08 11:21

from django.db import migrations


def create_periods(apps, schema_editor):
    Period = apps.get_model('finance', 'Period')
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    data = []
    for month in months:
        data.append(Period(title = month, total_spend = 0, total_income = 0, total_savings = 0, total_saved_this_period = 0, start_balance = 0, end_balance = 0 ))

    Period.objects.bulk_create(data)


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0002_period'),
    ]

    operations = [
        migrations.RunPython(create_periods)
    ]
