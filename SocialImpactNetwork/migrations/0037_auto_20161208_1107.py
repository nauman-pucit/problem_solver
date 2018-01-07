# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0036_socialuser_is_admin'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resource',
            name='geographical_area',
            field=models.CharField(max_length=50),
        ),
    ]
