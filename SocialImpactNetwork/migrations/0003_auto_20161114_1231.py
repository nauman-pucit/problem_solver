# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0002_auto_20161111_1404'),
    ]

    operations = [
        migrations.CreateModel(
            name='Infrastructure',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Infrastructure_name', models.CharField(max_length=50)),
                ('Infrastructure_details', models.CharField(max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='Network',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('network_name', models.CharField(max_length=50)),
                ('network_description', models.CharField(max_length=500)),
            ],
        ),
        migrations.RemoveField(
            model_name='group',
            name='resource',
        ),
        migrations.AlterField(
            model_name='company',
            name='company_description',
            field=models.CharField(max_length=500),
        ),
        migrations.AlterField(
            model_name='company',
            name='resource',
            field=models.ForeignKey(default=1, to='SocialImpactNetwork.Resource'),
        ),
        migrations.AlterField(
            model_name='project',
            name='project_description',
            field=models.CharField(max_length=500),
        ),
        migrations.AlterField(
            model_name='project',
            name='resource',
            field=models.ForeignKey(default=1, to='SocialImpactNetwork.Resource'),
        ),
        migrations.AlterField(
            model_name='resource',
            name='resource_user',
            field=models.ForeignKey(default=1, to='SocialImpactNetwork.User'),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_type',
            field=models.ForeignKey(default=1, to='SocialImpactNetwork.UserType'),
        ),
        migrations.DeleteModel(
            name='Group',
        ),
        migrations.AddField(
            model_name='network',
            name='resource',
            field=models.ForeignKey(default=1, to='SocialImpactNetwork.Resource'),
        ),
        migrations.AddField(
            model_name='infrastructure',
            name='resource',
            field=models.ForeignKey(default=1, to='SocialImpactNetwork.Resource'),
        ),
    ]
