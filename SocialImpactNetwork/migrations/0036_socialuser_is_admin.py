# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0035_auto_20161207_0609'),
    ]

    operations = [
        migrations.AddField(
            model_name='socialuser',
            name='is_admin',
            field=models.BooleanField(default=False),
        ),
    ]
