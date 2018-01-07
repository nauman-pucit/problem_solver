from django.contrib.auth.models import BaseUserManager
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def _create_user(self, username, password, is_staff, is_supperuser, **extra_fields):
        """
        creates and save user with given username and password
        :param username:
        :param passwork:
        :param is_staff:
        :param is_supperuser:
        :param extra_fields:
        :return:
        """
        now = timezone.now()
        if not username:
            raise ValueError('The username must be set')

        user = self.model(username=username,
                          is_staff=is_staff, is_active=True,
                          is_supperuser=is_supperuser, last_login=now,
                          date_joined=now, **extra_fields)
        user.set_password(password)
        user.save(using=self.db)
        return user

    def create_user(self, username, password=None, **extra_fields):
        return self._create_user(username, password, False, False, **extra_fields)

    def create_superuser(self, username, password=None, **extra_fields):
        user = self._create_user(username, password, True, True, **extra_fields)

        user.is_admin = True
        user.save()

        return user
