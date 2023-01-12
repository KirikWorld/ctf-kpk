from django.db import models
from users.models import User, Teams


class Category(models.Model):
    title = models.CharField(max_length=50, verbose_name='Название')
    
    def __str__(self):
        return self.title
    
    
    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"


class Task(models.Model):
    title = models.CharField(max_length=30, verbose_name="Название", blank=False)
    description = models.TextField(verbose_name="Описание", blank=True)
    costs = models.IntegerField(verbose_name="Кол-во баллов", blank=False)
    file = models.FileField(verbose_name="Файл (если требуется)", blank=True, upload_to='uploads/')
    flag = models.CharField(verbose_name="Флаг", blank=False, max_length=120, help_text="По умолчанию флаг оборачивается в 'ctfKpk{}'")
    solves_by = models.ManyToManyField(User, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    
    def save(self, *args, **kwargs):
        if not self.flag.find('{') != -1:
            self.flag = "ctfKpk{" + self.flag + "}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    
    class Meta:
        verbose_name = "Таск"
        verbose_name_plural = "Таски"


class TeamsTasks(models.Model):
    title = models.CharField(max_length=30, verbose_name="Название", blank=False)
    description = models.TextField(verbose_name="Описание", blank=True)
    costs = models.IntegerField(verbose_name="Кол-во баллов", blank=False)
    file = models.FileField(verbose_name="Файл (если требуется)", blank=True, upload_to='uploads/')
    flag = models.CharField(verbose_name="Флаг", blank=False, max_length=120, help_text="По умолчанию флаг оборачивается в 'ctfKpk{}'")
    solves_by = models.ManyToManyField(Teams, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    
    def save(self, *args, **kwargs):
        if not self.flag.find('{') != -1:
            self.flag = "ctfKpk{" + self.flag + "}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    
    class Meta:
        verbose_name = "Командный таск"
        verbose_name_plural = "командные таски"
        