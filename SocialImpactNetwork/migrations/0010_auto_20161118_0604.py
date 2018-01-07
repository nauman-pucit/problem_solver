# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0009_socialuser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resource',
            name='resource_user',
            field=models.ForeignKey(default=1, to='SocialImpactNetwork.SocialUser'),
        ),
    ]
