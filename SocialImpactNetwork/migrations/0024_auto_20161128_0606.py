# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0023_auto_20161127_1158'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='resource',
            field=models.ForeignKey(to='SocialImpactNetwork.Resource'),
        ),
    ]
