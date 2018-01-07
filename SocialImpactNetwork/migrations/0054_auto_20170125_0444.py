# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0053_auto_20170124_1258'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='image',
            field=models.ImageField(default='uploaded_media/None/No-image.jpg', null=True, upload_to='uploaded_media', blank=True),
        ),
    ]
