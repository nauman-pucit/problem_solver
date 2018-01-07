# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0016_auto_20161122_0823'),
    ]

    operations = [
        migrations.RenameField(
            model_name='affiliations',
            old_name='resource',
            new_name='contact',
        ),
        migrations.RenameField(
            model_name='fieldsofwork',
            old_name='resource',
            new_name='network',
        ),
    ]
