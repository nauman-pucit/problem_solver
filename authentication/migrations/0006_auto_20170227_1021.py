# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0005_auto_20170220_0747'),
    ]

    operations = [
        migrations.RenameField(
            model_name='socialuser',
            old_name='firstName',
            new_name='first_name',
        ),
        migrations.RenameField(
            model_name='socialuser',
            old_name='lastName',
            new_name='last_name',
        ),
    ]
