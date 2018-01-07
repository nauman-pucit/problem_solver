# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0057_auto_20170315_1140'),
    ]

    operations = [
        migrations.CreateModel(
            name='LoungeAreaMember',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('email', models.CharField(max_length=50)),
                ('status', models.CharField(max_length=50)),
            ],
        ),
        migrations.AlterField(
            model_name='loungearea',
            name='created_date',
            field=models.DateTimeField(default=datetime.datetime(2017, 3, 20, 8, 10, 13, 938977, tzinfo=utc)),
        ),
        migrations.AddField(
            model_name='loungeareamember',
            name='lounge_area',
            field=models.ForeignKey(to='SocialImpactNetwork.LoungeArea'),
        ),
    ]
