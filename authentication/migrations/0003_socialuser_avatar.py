# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_auto_20161223_0959'),
    ]

    operations = [
        migrations.AddField(
            model_name='socialuser',
            name='avatar',
            field=models.ImageField(default=b'uploaded_media/None/no-user.jpg', null=True, upload_to=b'uploaded_media', blank=True),
        ),
    ]
