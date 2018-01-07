# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0059_auto_20170320_0814'),
    ]

    operations = [
        migrations.AlterField(
            model_name='loungearea',
            name='created_date',
            field=models.DateTimeField(default=datetime.datetime(2017, 3, 24, 10, 43, 14, 61300, tzinfo=utc)),
        ),
    ]
