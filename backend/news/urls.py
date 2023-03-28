from django.urls import path
from .views import ListNews

urlpatterns = [
    path('', ListNews.as_view())
]