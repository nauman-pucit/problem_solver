# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0025_auto_20161128_0620'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='resource',
            field=models.ForeignKey(to='SocialImpactNetwork.Resource'),
        ),
    ]
