# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SocialUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(null=True, verbose_name='last login', blank=True)),
                ('firstName', models.CharField(max_length=50)),
                ('lastName', models.CharField(max_length=50)),
                ('username', models.CharField(unique=True, max_length=50)),
                ('email', models.CharField(unique=True, max_length=50)),
                ('address1', models.CharField(max_length=50)),
                ('address2', models.CharField(max_length=50, blank=True)),
                ('phone', models.CharField(max_length=50)),
                ('zipcode', models.CharField(max_length=50)),
                ('city', models.CharField(max_length=50)),
                ('state', models.CharField(max_length=50)),
                ('country', models.CharField(max_length=50)),
                ('designation', models.CharField(max_length=50)),
                ('orgnaization', models.CharField(max_length=50)),
                ('geographical_area', models.CharField(max_length=50)),
                ('moderation', models.BooleanField(max_length=50)),
                ('anonymity', models.BooleanField(max_length=50)),
                ('is_admin', models.BooleanField(default=False, max_length=50)),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
            },
        ),
    ]
