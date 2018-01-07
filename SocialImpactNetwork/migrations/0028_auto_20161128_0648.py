# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0027_auto_20161128_0647'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resource',
            name='resource_type',
            field=models.ForeignKey(to='SocialImpactNetwork.ResourceType'),
        ),
        migrations.AlterField(
            model_name='resource',
            name='resource_user',
            field=models.ForeignKey(to='SocialImpactNetwork.SocialUser'),
        ),
    ]
