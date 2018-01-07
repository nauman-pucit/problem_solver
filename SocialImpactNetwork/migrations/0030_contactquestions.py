# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0029_merge'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContactQuestions',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('question', models.CharField(max_length=200)),
                ('project', models.ForeignKey(to='SocialImpactNetwork.Project')),
            ],
        ),
    ]
