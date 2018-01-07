# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0022_auto_20161127_1140'),
    ]

    operations = [
        migrations.AlterField(
            model_name='affiliations',
            name='contact',
            field=models.ForeignKey(default=1, to='SocialImpactNetwork.Contact'),
        ),
    ]
