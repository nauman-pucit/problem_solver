"""this file contains the models for the application SocialImpactNetwork"""
from __future__ import unicode_literals

from cities_light.models import Country, City
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone
from django.utils.datetime_safe import datetime

from authentication.models import SocialUser


class Category(models.Model):
    category_name = models.CharField(max_length=50)

    def __str__(self):
        return self.category_name


class ResourceType(models.Model):
    """
    this model defines the type of resource a user holds
    """
    resource_type = models.CharField(max_length=50)

    def __str__(self):
        return self.resource_type


class Resource(models.Model):
    """
    this model defines the resources that a user hold
    """
    resource_user = models.ForeignKey(SocialUser, on_delete=models.CASCADE)
    resource_type = models.ForeignKey(ResourceType, on_delete=models.CASCADE, default=0)
    resource_category = models.ManyToManyField(Category)
    geographical_area = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.geographical_area


class Skill(models.Model):
    skill_user = models.ForeignKey(SocialUser, on_delete=models.CASCADE)
    skill_name = models.CharField(max_length=50)
    skill_description = models.CharField(max_length=5000)
    skill_level = models.CharField(max_length=50)
    geographical_countries = models.ManyToManyField(Country, blank=True)
    geographical_cities = models.ManyToManyField(City, blank=True)

    def __str__(self):
        return self.skill_name


class Project(models.Model):
    """
    this model defines the Projects that a user owns
    """
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    project_name = models.CharField(max_length=50)
    project_description = models.CharField(max_length=5000)
    geographical_countries = models.ManyToManyField(Country, blank=True)
    geographical_cities = models.ManyToManyField(City, blank=True)

    def __str__(self):
        return self.project_name


class LoungeArea(models.Model):
    """
        this model defines the LoungeArea for users to interact
    """
    created_by = models.ForeignKey(SocialUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=5000)
    is_restricted = models.BooleanField(max_length=50, default=True)
    created_date = models.DateTimeField(default=timezone.now())

    def __str__(self):
        return self.name


class LoungeAreaMember(models.Model):
    """
    This model defines the members of lounge area
    """
    lounge_area = models.ForeignKey(LoungeArea, on_delete=models.CASCADE)
    email = models.CharField(max_length=50)
    status = models.CharField(max_length=50, default='Pending')


class Chat(models.Model):
    """
        this model defines the chat for resource
    """
    lounge_area = models.ForeignKey(LoungeArea, on_delete=models.CASCADE, null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True)
    sent_by = models.ForeignKey(SocialUser, on_delete=models.CASCADE)
    message = models.CharField(max_length=5000, null=True, blank=True)
    sent_time = models.DateTimeField(default=timezone.now)


class ContactQuestions(models.Model):
    """
    this model defines the questions by user for contacting him
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    question = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.question


class ContactQuestionAnswer(models.Model):
    """
    this model defines the questions by user for contacting him
    """
    question = models.ForeignKey(ContactQuestions, on_delete=models.CASCADE)
    answer = models.CharField(max_length=200)
    status = models.CharField(max_length=50, null=True, blank=True)
    # User who is answering questions
    user = models.ForeignKey(SocialUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.question


class Network(models.Model):
    """
    this model defines the groups that user involved in
    """
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    network_name = models.CharField(max_length=50)
    network_description = models.CharField(max_length=5000)
    geographical_countries = models.ManyToManyField(Country, blank=True)
    geographical_cities = models.ManyToManyField(City, blank=True)

    def __str__(self):
        return self.network_name


class FieldsOfWork(models.Model):
    """
    this model defines the fields of work for a network of the user
    """
    network = models.ForeignKey(Network, on_delete=models.CASCADE)
    field_name = models.CharField(max_length=50)

    def __str__(self):
        return self.field_name


class Contact(models.Model):
    """
    this model defines the Company that a user owns
    """
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True)
    network = models.ForeignKey(Network, on_delete=models.CASCADE, null=True, blank=True)
    contact_name = models.CharField(max_length=50)
    contact_email = models.CharField(max_length=50, blank=True, null=True)
    contact_description = models.CharField(max_length=5000)
    area_of_interests = models.CharField(max_length=500, null=True, blank=True)
    anonymity = models.BooleanField(default=False)
    image = models.ImageField(upload_to='uploaded_media',
                              default='uploaded_media/None/No-image.jpg', null=True, blank=True)

    def __str__(self):
        return self.contact_name


class Affiliations(models.Model):
    """
    this model defines the affiliations to a contact that a user owns
    """
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    organization = models.CharField(max_length=50)

    def __str__(self):
        return self.organization


class Infrastructure(models.Model):
    """
    this model defines the Infrastructure that a user owns

    """
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, default=1)
    Infrastructure_name = models.CharField(max_length=50)
    Infrastructure_details = models.CharField(max_length=500)

    def __str__(self):
        return self.Infrastructure_name
