# Generated by Django 4.2.5 on 2023-10-17 14:18

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ecoautomotive', '0026_userordertracking'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='UserOrderTracking',
            new_name='OrderTracking',
        ),
    ]
