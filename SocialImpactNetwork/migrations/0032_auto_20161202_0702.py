# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0031_auto_20161202_0638'),
    ]

    operations = [
        migrations.AddField(
            model_name='socialuser',
            name='anonymity',
            field=models.BooleanField(default=0, max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='socialuser',
            name='moderation',
            field=models.BooleanField(default=0, max_length=50),
            preserve_default=False,
        ),
    ]
