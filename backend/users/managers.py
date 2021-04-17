from django.contrib.auth.base_user import BaseUserManager
from django.db.models import Q


class UserManager(BaseUserManager):
    def _create_user(self, email, password=None, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            # We do this because we shouldn't actually need passwords, but sometimes django
            # wont do some stuff if you don't have a usable password. A blank password also is
            # fine, but sometimes a field gets corrupt cuasing annoyance. This forces something
            # "usable"
            user.set_password(self.make_random_password(length=20))
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")
        return self._create_user(email, password, **extra_fields)

    def get_or_create(self, defaults=None, **kwargs):
        try:
            user = self.model.objects.filter(
                Q(sub=kwargs.get("sub", None)) | Q(email=kwargs["email"])
            )
            if user.count() > 1:
                raise Exception("Multiple User objects returned")

            return user.get(), False
        except self.model.DoesNotExist:
            user = self._create_user(**kwargs)
            return user, True
