# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0013_auto_20161118_1237'),
    ]

    operations = [
        migrations.DeleteModel(
            name='User',
        ),
    ]
