from django.contrib import admin
from .models import User, Teams
from django.contrib.auth.admin import UserAdmin
import nested_admin
from django.utils.html import format_html, escape
# from html import escape

UserAdmin.list_display += ('group', 'points', )
UserAdmin.fieldsets += (('Доп. поля',
                        {'fields': ('group', 'points', 'team')}),)
admin.site.register(User, UserAdmin)


@admin.register(Teams)
class TeamsAdmin(nested_admin.NestedModelAdmin):
    list_display = ('title', 'points', 'max_members',
                    'institution', 'active', 'get_user_list')

    def get_user_list(self, obj):
        return format_html("<br>".join([(f"<a href=\"/admin/users/user/{u.id}/change/\">{escape(u.username.replace('{', '&#123;').replace('}', '&#125;'))}</a>") for u in obj.users.all()]))

    get_user_list.short_description = "Участники"
