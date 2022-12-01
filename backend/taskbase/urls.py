from django.urls import path
from taskbase.views import *

urlpatterns = [
    path('', ListTasks.as_view())
    # path('', index),
    # path('teams/', teams)
]
