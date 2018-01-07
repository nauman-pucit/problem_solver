# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0014_delete_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='Affiliations',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('contact_name', models.CharField(max_length=50)),
                ('contact_description', models.CharField(max_length=500)),
                ('resource', models.ForeignKey(default=1, to='SocialImpactNetwork.Contact')),
            ],
        ),
        migrations.CreateModel(
            name='FieldsOfWork',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('field_name', models.CharField(max_length=50)),
                ('field_description', models.CharField(max_length=500)),
                ('resource', models.ForeignKey(default=1, to='SocialImpactNetwork.Network')),
            ],
        ),
    ]
