# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_auto_20161223_0959'),
        ('SocialImpactNetwork', '0042_contactquestionanswer_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('message', models.CharField(max_length=5000, null=True, blank=True)),
                ('sent_time', models.DateTimeField(default=datetime.datetime(2016, 12, 28, 4, 42, 28, 490801))),
                ('resource', models.ForeignKey(to='SocialImpactNetwork.Resource')),
                ('sent_by', models.ForeignKey(to='authentication.SocialUser')),
            ],
        ),
    ]
