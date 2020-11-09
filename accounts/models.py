from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Create your models here.
class UserType(models.Model):
    type = models.CharField(max_length=255, unique=True)

    # def __str__(self):
    #     return "the user type is %s and id is %s" % (self.type, self.id)


def get_usertype(usertype):
    return UserType.objects.get(type=usertype)


def get_default_usertype():
    return UserType.objects.get(type="PRODUCTION")


def get_default_artist_usertype():
    return UserType.objects.get(type="ARTIST")


# Create your models here.
class UserManager(BaseUserManager):
    def create_user(
        self,
        email,
        username,
        igene_id,
        usertype=get_default_usertype(),
        password=None,
        is_active=True,
        is_staff=False,
        is_admin=False,
    ):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have an username")
        if not password:
            raise ValueError("Users must have a password")
        user_obj = self.model(
            email=self.normalize_email(email), username=username, igene_id=igene_id
        )
        user_obj.usertype = usertype
        user_obj.set_password(password)  # change user password
        user_obj.staff = is_staff
        user_obj.admin = is_admin
        user_obj.is_active = is_active
        user_obj.save(using=self._db)
        return user_obj

    def create_staffuser(self, email, username, igene_id=None, password=None):
        user = self.create_user(
            email, username, igene_id=igene_id, password=password, is_staff=True
        )
        return user

    def create_superuser(self, email, username, igene_id=None, password=None):
        user = self.create_user(
            email,
            username,
            igene_id=igene_id,
            password=password,
            is_staff=True,
            is_admin=True,
        )
        return user


class User(AbstractBaseUser):
    usertype = models.ForeignKey(
        UserType,
        related_name="users",
        on_delete=models.CASCADE,
        default=get_default_artist_usertype,
    )
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True)
    # dept = models.CharField(max_length=255, null=True)
    # designation = models.CharField(max_length=255, null=True)
    # doj = models.DateField(null=True)
    # igene_id = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)  # can login
    staff = models.BooleanField(default=False)  # staff user non superuser
    admin = models.BooleanField(default=False)  # superuser
    timestamp = models.DateTimeField(auto_now_add=True)
    # confirm     = models.BooleanField(default=False)
    # confirmed_date     = models.DateTimeField(default=False)

    USERNAME_FIELD = "username"  # username
    # USERNAME_FIELD and password are required by default
    REQUIRED_FIELDS = [
        "email",
    ]  # ['username'] #python manage.py createsuperuser

    objects = UserManager()

    def __str__(self):
        return f"User('{self.email}', '{self.username}')"
        # return self.email

    def get_username(self):
        if self.username:
            return self.username
        return self.email

    def get_short_name(self):
        return f"User('{self.email}', '{self.username}')"
        # return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        if self.is_admin:
            return True
        return self.staff

    @property
    def is_admin(self):
        return self.admin
