from django.urls import path
from .views import *

urlpatterns = [
    path('', index),
    path('signin/', index),
    path('signup', index),
    path('me/', index),
    path('tasks/', index)
]