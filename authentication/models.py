from django.contrib.auth.models import AbstractBaseUser
from django.db import models
from django.utils.translation import ugettext_lazy as _

from authentication.manager import CustomUserManager


class SocialUser(AbstractBaseUser):
    """
    this class is a model for Users of the application
    """

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    username = models.CharField(max_length=50, unique=True)
    # password = models.CharField(max_length=50)
    email = models.CharField(max_length=50, unique=True)
    address1 = models.CharField(max_length=50, blank=True)
    address2 = models.CharField(max_length=50, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    zipcode = models.CharField(max_length=50, blank=True)
    city = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=50, blank=True)
    designation = models.CharField(max_length=50, blank=True)
    orgnaization = models.CharField(max_length=50, blank=True)
    geographical_area = models.CharField(max_length=50, blank=True)
    moderation = models.BooleanField(default=False)
    anonymity = models.BooleanField(default=False)
    is_admin = models.BooleanField(max_length=50, default=False)
    avatar = models.ImageField(upload_to='uploaded_media', default='uploaded_media/None/no-user.jpg', null=True,
                              blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'username', 'address1', 'phone',
                       'zipcode', 'city', 'state', 'country', 'designation', 'orgnaization', 'geographical_area',
                       'moderation', 'anonymity', 'is_admin']
    objects = CustomUserManager()

    class Meta:
        managed = True
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def get_full_name(self):
        """:returns return full name of user"""
        full_name = '%s %s' %(self.firstName, self.lastName)
        return full_name.strip()

    def get_short_name(self):
        """:returns return first name of the user"""
        return self.firstName

    def is_staff(self):
        return self.is_admin

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin

    def __str__(self):
        return self.username
