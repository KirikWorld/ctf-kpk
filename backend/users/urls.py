from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CurrentUser, UsersRank, UserResetPassword, UserResetPasswordConfirm

# router = DefaultRouter()
# router.register(r'users', UserViewSet)

urlpatterns = [
    # path('', include(router.urls)),
    path('me/', CurrentUser.as_view()),
    path('ranks/', UsersRank.as_view()),
    path('password_reset/', UserResetPassword),
    path('password_reset/<str:token>/<str:password>', UserResetPasswordConfirm)
]
