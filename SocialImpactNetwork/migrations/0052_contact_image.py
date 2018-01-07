# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0051_auto_20170118_0729'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='image',
            field=models.FileField(null=True, upload_to=b'', blank=True),
        ),
    ]
