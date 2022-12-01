from users.models import User
from users.serializers import UserSerializer
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework import authentication
from rest_framework import permissions
from rest_framework.response import Response


# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
    

class CurrentUser(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        return Response({"user": request.user.username, "points": request.user.points})
    

class UsersRank(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        return Response({user.pk: {"username": user.username, "points": user.points} for user in User.objects.order_by("-points")})
    