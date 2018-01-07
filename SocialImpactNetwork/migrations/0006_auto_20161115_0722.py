# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0005_auto_20161115_0718'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='resource',
            field=models.ForeignKey(default=2, to='SocialImpactNetwork.Resource'),
        ),
        migrations.AlterField(
            model_name='network',
            name='resource',
            field=models.ForeignKey(default=2, to='SocialImpactNetwork.Resource'),
        ),
        migrations.AlterField(
            model_name='project',
            name='resource',
            field=models.ForeignKey(default=2, to='SocialImpactNetwork.Resource'),
        ),
    ]
