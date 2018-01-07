# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0041_auto_20161214_0616'),
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='contactquestionanswer',
            name='status',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
    ]
