# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0043_chat'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chat',
            name='resource',
        ),
        migrations.AddField(
            model_name='chat',
            name='project',
            field=models.ForeignKey(default=1, to='SocialImpactNetwork.Project'),
        ),
        migrations.AlterField(
            model_name='chat',
            name='sent_time',
            field=models.DateTimeField(default=datetime.datetime(2016, 12, 28, 7, 25, 49, 279508)),
        ),
    ]
