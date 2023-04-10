from django.urls import path,  re_path
from .views import *

urlpatterns = [
    path('', index),
    path('signin/', index),
    path('signup', index),
    path('me/', index),
    path('tasks/', index),
    path('teams/', index),
    path('teams/tasks/', index),
    re_path(r'^invintation', index)
]