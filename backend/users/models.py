from typing import Any, Tuple, Union

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_extensions.db.models import TimeStampedModel


from .managers import (
    UserManager,
)


class User(PermissionsMixin, TimeStampedModel, AbstractBaseUser):
    USERNAME_FIELD = "email"
    email = models.EmailField(_("email address"), unique=True)
    first_name = models.CharField(_("first name"), max_length=30, blank=True)
    last_name = models.CharField(_("last name"), max_length=150, blank=True)
    is_staff = models.BooleanField(_("staff status"), default=False)
    is_active = models.BooleanField(_("active"), default=True)

    objects = UserManager()

    def __str__(self):
        return self.full_name  # pragma: no cover

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
