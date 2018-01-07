# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0020_auto_20161126_1017'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='area_of_interests',
            field=models.CharField(max_length=500, null=True, blank=True),
        ),
    ]
