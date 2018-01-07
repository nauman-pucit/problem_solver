# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='socialuser',
            name='address1',
            field=models.CharField(max_length=50, blank=True),
        ),
        migrations.AlterField(
            model_name='socialuser',
            name='city',
            field=models.CharField(max_length=50, blank=True),
        ),
        migrations.AlterField(
            model_name='socialuser',
            name='country',
            field=models.CharField(max_length=50, blank=True),
        ),
        migrations.AlterField(
            model_name='socialuser',
            name='designation',
            field=models.CharField(max_length=50, blank=True),
        ),
        migrations.AlterField(
            model_name='socialuser',
            name='geographical_area',
            field=models.CharField(max_length=50, blank=True),
        ),
        migrations.AlterField(
            model_name='socialuser',
            name='orgnaization',
            field=models.CharField(max_length=50, blank=True),
        ),
        migrations.AlterField(
            model_name='socialuser',
            name='phone',
            field=models.CharField(max_length=50, blank=True),
        ),
        migrations.AlterField(
            model_name='socialuser',
            name='state',
            field=models.CharField(max_length=50, blank=True),
        ),
        migrations.AlterField(
            model_name='socialuser',
            name='zipcode',
            field=models.CharField(max_length=50, blank=True),
        ),
    ]
