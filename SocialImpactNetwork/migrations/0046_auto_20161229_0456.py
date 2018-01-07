# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0045_auto_20161228_0726'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='sent_time',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.RemoveField(
            model_name='resource',
            name='resource_category',
        ),
        migrations.AddField(
            model_name='resource',
            name='resource_category',
            field=models.ManyToManyField(to='SocialImpactNetwork.Category'),
        ),
    ]
