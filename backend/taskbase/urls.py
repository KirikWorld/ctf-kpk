from django.urls import path
from taskbase.views import *

urlpatterns = [
    path('', ListTasks.as_view()),
    path('categories/', ListCat.as_view()),
    path('daily', DailyList.as_view()),
    path('teams/', ListTeamsTasks.as_view()),
    # path('teams/', teams)
]
