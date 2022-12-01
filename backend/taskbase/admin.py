from django.contrib import admin
from taskbase.models import Task, TeamsTasks, Category


class TaskInline(admin.TabularInline):
    model = Task.solves_by.through
    extra = 0
    

class TeamTaskInline(admin.TabularInline):
    model = TeamsTasks.solves_by.through
    extra = 0
    

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    fields = ['category', 'title', 'description', 'costs', 'flag', 'file']
    inlines = (
        TaskInline,
    )
    
    
@admin.register(TeamsTasks)
class TaskAdmin(admin.ModelAdmin):
    fields = ['category', 'title', 'description', 'costs', 'flag', 'file']
    inlines = (
        TeamTaskInline,
    )
    
    
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    fields = ['title', ]
    # inlines = (
    #     TeamTaskInline,
    # )
    