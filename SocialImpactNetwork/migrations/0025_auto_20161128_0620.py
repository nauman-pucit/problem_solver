# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0024_auto_20161128_0606'),
    ]

    operations = [
        migrations.AlterField(
            model_name='affiliations',
            name='contact',
            field=models.ForeignKey(to='SocialImpactNetwork.Contact'),
        ),
    ]
