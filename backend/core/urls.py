from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from app.views import index
from users.views import UserActivation

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('', include('app.urls')),
                  path('api/tasks/', include('taskbase.urls')),
                  path('auth/', include('djoser.urls')),
                  path('api/auth/', include('djoser.urls.authtoken')),
                  path('api/users/', include('users.urls')),
                  re_path(r'signin/activate/(?P<uid>[\w-]+)/(?P<token>[\w-]+)/$', UserActivation),
                  re_path(r'media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT})
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) \
              + static(settings.STATIC_URL,
                       document_root=settings.STATIC_ROOT)
