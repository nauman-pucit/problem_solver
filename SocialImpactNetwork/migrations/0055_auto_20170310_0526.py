# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('cities_light', '0006_compensate_for_0003_bytestring_bug'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('SocialImpactNetwork', '0054_auto_20170125_0444'),
    ]

    operations = [
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('skill_name', models.CharField(max_length=50)),
                ('skill_description', models.CharField(max_length=50)),
                ('skill_level', models.CharField(max_length=50)),
                ('geographical_cities', models.ManyToManyField(to='cities_light.City', blank=True)),
                ('geographical_countries', models.ManyToManyField(to='cities_light.Country', blank=True)),
                ('skill_user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='contact',
            name='skill',
            field=models.ForeignKey(blank=True, to='SocialImpactNetwork.Skill', null=True),
        ),
    ]
