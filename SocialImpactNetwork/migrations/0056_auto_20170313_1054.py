# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0055_auto_20170310_0526'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='contact_description',
            field=models.CharField(max_length=5000),
        ),
        migrations.AlterField(
            model_name='network',
            name='network_description',
            field=models.CharField(max_length=5000),
        ),
        migrations.AlterField(
            model_name='project',
            name='project_description',
            field=models.CharField(max_length=5000),
        ),
        migrations.AlterField(
            model_name='skill',
            name='skill_description',
            field=models.CharField(max_length=5000),
        ),
    ]
