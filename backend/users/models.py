from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.core.validators import MaxValueValidator, MinValueValidator
import hashlib
import random


class UserManager(BaseUserManager):
    def create_user(self, username, password, points=0, **extra_fields):
        username = username
        user = self.model(username=username, points=points, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password, points=0, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(username, password, points, **extra_fields)


class User(AbstractUser):
    username = models.CharField(
        max_length=30, verbose_name="Никнейм", unique=True)
    email = models.EmailField(unique=True)
    points = models.IntegerField(verbose_name="Кол-во очков", default=0)
    group = models.CharField(verbose_name="Группа", max_length=10, blank=False)
    team = models.ForeignKey(
        'Teams', on_delete=models.SET_NULL, null=True, blank=True, default=None, related_name='users')

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['group', 'first_name', 'last_name', 'email']
    objects = UserManager()

    def __str__(self):
        return self.username


class Teams(models.Model):
    title = models.CharField(max_length=50, verbose_name="Название", blank=False, unique=True)
    points = models.IntegerField(verbose_name="Кол-во очков", default=0)
    teamLead = models.ForeignKey(User, on_delete=models.SET_NULL,
                                 null=True, blank=True, default=None, related_name='teamlead', verbose_name="Капитан")
    institution = models.CharField(max_length=100, verbose_name="Учебное заведение", blank=False)
    active=models.BooleanField(verbose_name="Активно", default=False)
    max_members = models.IntegerField(
        verbose_name="Максимальное кол-во участников", default=1, validators=[
            MaxValueValidator(5),
            MinValueValidator(1)
        ])
    invintation = models.CharField(
        verbose_name="Токен приглашения", unique=True, editable=True, max_length=250, default="random")

    def save(self, *args, **kwargs):
        self.invintation = hashlib.pbkdf2_hmac(
            "sha256",  # Используемый алгоритм хеширования
            self.title.encode("utf-8"),  # Конвертирование в байты
            bytes(random.randint(100, 10000)),  # Предоставление соли
            150130,  # Рекомендуется использоваться по крайней мере 100000 итераций SHA-256
            dklen=10  # длина derived key
        ).hex()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Команда'
        verbose_name_plural = "Команды"
