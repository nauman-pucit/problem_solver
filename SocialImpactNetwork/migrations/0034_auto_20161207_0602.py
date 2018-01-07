# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0033_socialuser_grographical_area'),
    ]

    operations = [
        migrations.AlterField(
            model_name='socialuser',
            name='grographical_area',
            field=models.CharField(max_length=50),
        ),
    ]
