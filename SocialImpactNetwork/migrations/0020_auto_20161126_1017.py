# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0019_auto_20161123_1245'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='resource',
            name='resource_name',
        ),
        migrations.AlterField(
            model_name='contact',
            name='resource',
            field=models.ForeignKey(default=3, to='SocialImpactNetwork.Resource'),
        ),
        migrations.AlterField(
            model_name='network',
            name='resource',
            field=models.ForeignKey(default=2, to='SocialImpactNetwork.Resource'),
        ),
    ]
