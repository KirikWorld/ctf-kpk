from django.contrib import admin
from .models import User, Teams
from django.contrib.auth.admin import UserAdmin

UserAdmin.list_display += ('group', )
UserAdmin.fieldsets +=  (('Доп. поля', {'fields': ('group', )}),)
admin.site.register(User, UserAdmin)
# @admin.register(User)
# class UserAdmin(UserAdmin):
#     list_display = ('username', 'group', 'points')
    
    
# @admin.register(User)
# class EditUser(admin.ModelAdmin):
#     list_display = ('username', 'group', 'points')
    

@admin.register(Teams)
class UserAdmin(admin.ModelAdmin):
    list_display = ('title', 'points')