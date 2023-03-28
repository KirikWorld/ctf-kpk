from django.db import models
from tinymce.models import HTMLField


class News(models.Model):
    title = models.CharField(verbose_name="Название", max_length=255, blank=False)
    description = HTMLField(verbose_name="Контент")
    preview = models.ImageField(verbose_name="Превью", blank=True)
    created_at = models.DateTimeField(verbose_name="Создано в", auto_now=True)
    
    def __str__(self):
        return self.title
    
    
    class Meta:
        verbose_name = "Новость"
        verbose_name_plural = "Новости"
        