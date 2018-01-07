# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0034_auto_20161207_0602'),
    ]

    operations = [
        migrations.RenameField(
            model_name='socialuser',
            old_name='grographical_area',
            new_name='geographical_area',
        ),
    ]
