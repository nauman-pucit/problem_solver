# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('company_name', models.CharField(max_length=50)),
                ('company_description', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('group_name', models.CharField(max_length=50)),
                ('group_description', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('project_name', models.CharField(max_length=50)),
                ('project_description', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Resource',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('resource_name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='ResourceType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('resource_type', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='UserType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('user_type_name', models.CharField(max_length=50)),
            ],
        ),
        migrations.AddField(
            model_name='resource',
            name='resource_type',
            field=models.ForeignKey(to='SocialImpactNetwork.ResourceType'),
        ),
        migrations.AddField(
            model_name='resource',
            name='resource_user',
            field=models.ForeignKey(to='SocialImpactNetwork.User'),
        ),
        migrations.AddField(
            model_name='project',
            name='resource',
            field=models.ForeignKey(to='SocialImpactNetwork.Resource'),
        ),
        migrations.AddField(
            model_name='group',
            name='resource',
            field=models.ForeignKey(to='SocialImpactNetwork.Resource'),
        ),
        migrations.AddField(
            model_name='company',
            name='resource',
            field=models.ForeignKey(to='SocialImpactNetwork.Resource'),
        ),
        migrations.AddField(
            model_name='user',
            name='user_type',
            field=models.ForeignKey(default=1, to='SocialImpactNetwork.UserType'),
            preserve_default=False,
        ),
    ]
