# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0036_socialuser_is_admin'),
    ]

    operations = [
        migrations.AddField(
            model_name='contactquestions',
            name='answer',
            field=models.CharField(max_length=200, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='contactquestions',
            name='resource',
            field=models.ForeignKey(blank=True, to='SocialImpactNetwork.Resource', null=True),
        ),
        migrations.AlterField(
            model_name='contactquestions',
            name='question',
            field=models.CharField(max_length=200, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='resource',
            name='geographical_area',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
    ]
