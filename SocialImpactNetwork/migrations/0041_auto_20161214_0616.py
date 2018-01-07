# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0040_merge'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contactquestionanswer',
            name='user',
            field=models.ForeignKey(to='authentication.SocialUser'),
        ),
        migrations.AlterField(
            model_name='resource',
            name='geographical_area',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='resource',
            name='resource_user',
            field=models.ForeignKey(to='authentication.SocialUser'),
        ),
        migrations.DeleteModel(
            name='SocialUser',
        ),
    ]
