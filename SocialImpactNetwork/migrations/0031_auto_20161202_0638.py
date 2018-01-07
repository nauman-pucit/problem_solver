# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0030_contactquestions'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('category_name', models.CharField(max_length=50)),
            ],
        ),
        migrations.AddField(
            model_name='resource',
            name='geographical_area',
            field=models.CharField(default='Pakistan', max_length=50),
        ),
        migrations.AlterField(
            model_name='resource',
            name='resource_type',
            field=models.ForeignKey(to='SocialImpactNetwork.ResourceType'),
        ),
        migrations.AddField(
            model_name='resource',
            name='resource_category',
            field=models.ForeignKey(blank=True, to='SocialImpactNetwork.Category', null=True),
        ),
    ]
