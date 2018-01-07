# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0044_auto_20161228_0725'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='project',
            field=models.ForeignKey(to='SocialImpactNetwork.Project'),
        ),
        migrations.AlterField(
            model_name='chat',
            name='sent_time',
            field=models.DateTimeField(default=datetime.datetime(2016, 12, 28, 7, 26, 11, 358028)),
        ),
    ]
