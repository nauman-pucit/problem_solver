# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0046_auto_20161229_0456'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='area_of_work',
        ),
    ]
