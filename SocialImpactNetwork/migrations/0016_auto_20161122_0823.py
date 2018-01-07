# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0015_affiliations_fieldsofwork'),
    ]

    operations = [
        migrations.RenameField(
            model_name='affiliations',
            old_name='contact_description',
            new_name='affiliated_contact_description',
        ),
        migrations.RenameField(
            model_name='affiliations',
            old_name='contact_name',
            new_name='affiliated_contact_name',
        ),
    ]
