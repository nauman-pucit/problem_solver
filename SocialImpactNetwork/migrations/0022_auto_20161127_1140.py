# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialImpactNetwork', '0021_remove_affiliations_affiliated_contact_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='affiliations',
            name='contact',
            field=models.ForeignKey(to='SocialImpactNetwork.Contact'),
        ),
    ]
