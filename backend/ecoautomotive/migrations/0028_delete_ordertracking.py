# Generated by Django 4.2.5 on 2023-10-17 14:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ecoautomotive', '0027_rename_userordertracking_ordertracking'),
    ]

    operations = [
        migrations.DeleteModel(
            name='OrderTracking',
        ),
    ]
