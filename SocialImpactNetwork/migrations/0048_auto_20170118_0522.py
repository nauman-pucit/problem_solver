# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cities_light', '0006_compensate_for_0003_bytestring_bug'),
        ('SocialImpactNetwork', '0047_remove_project_area_of_work'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contact',
            name='resource',
        ),
        migrations.AddField(
            model_name='contact',
            name='anonymity',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='contact',
            name='contact_email',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='contact',
            name='network',
            field=models.ForeignKey(blank=True, to='SocialImpactNetwork.Network', null=True),
        ),
        migrations.AddField(
            model_name='contact',
            name='project',
            field=models.ForeignKey(blank=True, to='SocialImpactNetwork.Project', null=True),
        ),
        migrations.AddField(
            model_name='network',
            name='geographical_cities',
            field=models.ManyToManyField(to='cities_light.City'),
        ),
        migrations.AddField(
            model_name='network',
            name='geographical_countries',
            field=models.ManyToManyField(to='cities_light.Country'),
        ),
        migrations.AddField(
            model_name='project',
            name='geographical_cities',
            field=models.ManyToManyField(to='cities_light.City'),
        ),
        migrations.AddField(
            model_name='project',
            name='geographical_countries',
            field=models.ManyToManyField(to='cities_light.Country'),
        ),
    ]
