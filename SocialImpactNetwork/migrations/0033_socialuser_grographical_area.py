# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0032_auto_20161202_0702'),
    ]

    operations = [
        migrations.AddField(
            model_name='socialuser',
            name='grographical_area',
            field=models.CharField(default='pakistan', max_length=50),
        ),
    ]
