# Generated by Django 4.2.2 on 2023-08-05 16:16

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("finance", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="expense",
            old_name="category_id",
            new_name="category",
        ),
        migrations.RenameField(
            model_name="income",
            old_name="category_id",
            new_name="category",
        ),
    ]
