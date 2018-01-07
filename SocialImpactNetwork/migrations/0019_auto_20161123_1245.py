# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0018_auto_20161122_1234'),
    ]

    operations = [
        migrations.AlterField(
            model_name='socialuser',
            name='address2',
            field=models.CharField(max_length=50, blank=True),
        ),
    ]
