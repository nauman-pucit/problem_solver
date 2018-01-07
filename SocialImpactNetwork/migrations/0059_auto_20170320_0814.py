# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0058_auto_20170320_0810'),
    ]

    operations = [
        migrations.AlterField(
            model_name='loungearea',
            name='created_date',
            field=models.DateTimeField(default=datetime.datetime(2017, 3, 20, 8, 14, 38, 919344, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='loungeareamember',
            name='status',
            field=models.CharField(default='Pending', max_length=50),
        ),
    ]
