# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0038_auto_20161208_0717'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContactQuestionAnswer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('answer', models.CharField(max_length=200)),
                ('question', models.ForeignKey(to='SocialImpactNetwork.ContactQuestions')),
                ('user', models.ForeignKey(to='SocialImpactNetwork.SocialUser')),
            ],
        ),
    ]
