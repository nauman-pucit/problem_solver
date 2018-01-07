# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0026_auto_20161128_0633'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fieldsofwork',
            name='network',
            field=models.ForeignKey(to='SocialImpactNetwork.Network'),
        ),
        migrations.AlterField(
            model_name='network',
            name='resource',
            field=models.ForeignKey(to='SocialImpactNetwork.Resource'),
        ),
    ]
