from django.urls import path
from .views import TeamsView, TeamsInvintation, TeamsRanks

urlpatterns = [
    path("", TeamsView.as_view()),
    path("invite", TeamsInvintation.as_view()),
    path("ranks",TeamsRanks.as_view())
]
