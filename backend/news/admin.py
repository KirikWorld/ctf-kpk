from django.contrib import admin
from .models import News


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', )
    fields = ('title', 'description', 'preview', 'created_at')
    readonly_fields=('created_at',)
    