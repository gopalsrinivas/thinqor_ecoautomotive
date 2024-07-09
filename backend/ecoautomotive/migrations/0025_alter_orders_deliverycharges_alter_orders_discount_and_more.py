# Generated by Django 4.2.5 on 2023-10-17 05:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecoautomotive', '0024_alter_orders_deliverycharges_alter_orders_discount_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orders',
            name='deliverycharges',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='orders',
            name='discount',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='orders',
            name='total_amount',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
    ]
