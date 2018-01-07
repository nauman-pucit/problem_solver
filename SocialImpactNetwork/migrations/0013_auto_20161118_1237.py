# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0012_auto_20161118_1123'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('contact_name', models.CharField(max_length=50)),
                ('contact_description', models.CharField(max_length=500)),
                ('resource', models.ForeignKey(default=1, to='SocialImpactNetwork.Resource')),
            ],
        ),
        migrations.RemoveField(
            model_name='company',
            name='resource',
        ),
        migrations.DeleteModel(
            name='Company',
        ),
    ]
