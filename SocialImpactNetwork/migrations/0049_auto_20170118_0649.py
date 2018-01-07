# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0048_auto_20170118_0522'),
    ]

    operations = [
        migrations.AlterField(
            model_name='network',
            name='geographical_cities',
            field=models.ManyToManyField(to='cities_light.City', null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='network',
            name='geographical_countries',
            field=models.ManyToManyField(to='cities_light.Country', null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='geographical_cities',
            field=models.ManyToManyField(to='cities_light.City', null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='geographical_countries',
            field=models.ManyToManyField(to='cities_light.Country', null=True, blank=True),
        ),
    ]
