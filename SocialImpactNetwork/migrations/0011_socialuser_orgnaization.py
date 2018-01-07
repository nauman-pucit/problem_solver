# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0010_auto_20161118_0604'),
    ]

    operations = [
        migrations.AddField(
            model_name='socialuser',
            name='orgnaization',
            field=models.CharField(default=datetime.datetime(2016, 11, 18, 10, 55, 50, 449293, tzinfo=utc), max_length=50),
            preserve_default=False,
        ),
    ]
