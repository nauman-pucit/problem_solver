# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0037_auto_20161208_0647'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contactquestions',
            name='answer',
        ),
        migrations.RemoveField(
            model_name='contactquestions',
            name='resource',
        ),
    ]
