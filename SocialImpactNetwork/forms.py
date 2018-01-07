"""
this class contains the forms of the application 'SocialImpactNetwork'
"""
from django import forms

from .models import *


class UserForm(forms.ModelForm):
    """
    this class is a model form for user's information
    """
    class Meta:
        model = SocialUser
        fields = ['username', 'password']


class ProjectForm(forms.ModelForm):
    """
    this class is model form for Projects
    """
    class Meta:
        model = Project
        fields = ['project_name', 'project_description']


class NetworkForm(forms.ModelForm):
    """
        this class is model form for Networks
    """
    class Meta:
        model = Network
        fields = ['network_name', 'network_description']


class FieldOfWorkForm(forms.ModelForm):
    """
    this class is model form for fields of work for a network
    """
    class Meta:
        model = FieldsOfWork
        fields = ['field_name']


class ContactForm(forms.ModelForm):
    """
        this class is model form for Company
    """
    class Meta:
        model = Contact
        fields = ['contact_name', 'contact_description']


class AffiliationForm(forms.ModelForm):
    """
    this class is model form for affiliations of Contacts
    """
    class Meta:
        model = Affiliations
        fields = ['organization', ]

