# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0007_auto_20161116_1121'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='resource',
            field=models.ForeignKey(default=1, to='SocialImpactNetwork.Resource'),
        ),
        migrations.AlterField(
            model_name='infrastructure',
            name='resource',
            field=models.ForeignKey(default=1, to='SocialImpactNetwork.Resource'),
        ),
        migrations.AlterField(
            model_name='network',
            name='resource',
            field=models.ForeignKey(default=1, to='SocialImpactNetwork.Resource'),
        ),
        migrations.AlterField(
            model_name='project',
            name='resource',
            field=models.ForeignKey(default=1, to='SocialImpactNetwork.Resource'),
        ),
        migrations.AlterField(
            model_name='resource',
            name='resource_type',
            field=models.ForeignKey(default=1, to='SocialImpactNetwork.ResourceType'),
        ),
    ]
