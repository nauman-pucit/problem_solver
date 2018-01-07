# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0004_auto_20170216_0955'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='socialuser',
            options={'managed': True, 'verbose_name': 'user', 'verbose_name_plural': 'users'},
        ),
    ]
