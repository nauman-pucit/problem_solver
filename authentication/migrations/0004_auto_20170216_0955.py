# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_socialuser_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='socialuser',
            name='anonymity',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='socialuser',
            name='moderation',
            field=models.BooleanField(default=False),
        ),
    ]
