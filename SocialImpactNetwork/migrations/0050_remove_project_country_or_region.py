# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0049_auto_20170118_0649'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='country_or_region',
        ),
    ]
