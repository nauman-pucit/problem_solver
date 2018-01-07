# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0011_socialuser_orgnaization'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='area_of_work',
            field=models.CharField(default=datetime.datetime(2016, 11, 18, 11, 23, 5, 913298, tzinfo=utc), max_length=500),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='project',
            name='country_or_region',
            field=models.CharField(default=datetime.datetime(2016, 11, 18, 11, 23, 39, 853521, tzinfo=utc), max_length=500),
            preserve_default=False,
        ),
    ]
