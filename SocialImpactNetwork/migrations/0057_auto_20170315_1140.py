# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('SocialImpactNetwork', '0056_auto_20170313_1054'),
    ]

    operations = [
        migrations.CreateModel(
            name='LoungeArea',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=5000)),
                ('is_restricted', models.BooleanField(default=True, max_length=50)),
                ('created_date', models.DateTimeField(default=datetime.datetime(2017, 3, 15, 11, 40, 59, 40579, tzinfo=utc))),
                ('created_by', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='chat',
            name='project',
            field=models.ForeignKey(blank=True, to='SocialImpactNetwork.Project', null=True),
        ),
        migrations.AddField(
            model_name='chat',
            name='lounge_area',
            field=models.ForeignKey(blank=True, to='SocialImpactNetwork.LoungeArea', null=True),
        ),
    ]
