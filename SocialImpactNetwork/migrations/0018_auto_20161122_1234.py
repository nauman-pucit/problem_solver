# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0017_auto_20161122_1023'),
    ]

    operations = [
        migrations.RenameField(
            model_name='affiliations',
            old_name='affiliated_contact_name',
            new_name='organization',
        ),
        migrations.RemoveField(
            model_name='fieldsofwork',
            name='field_description',
        ),
    ]
