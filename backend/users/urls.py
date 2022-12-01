from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CurrentUser, UsersRank

# router = DefaultRouter()
# router.register(r'users', UserViewSet)

urlpatterns = [
    # path('', include(router.urls)),
    path('me/', CurrentUser.as_view()),
    path('ranks/', UsersRank.as_view()),
]
