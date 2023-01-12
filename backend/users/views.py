from users.models import User
from rest_framework.views import APIView
from rest_framework import authentication
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from rest_framework import permissions
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponseRedirect

import requests


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
        return Response({user.pk: {"username": user.username, "points": user.points} for user in User.objects.order_by("-points") if user.is_active if not user.is_staff})
    

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def UserActivation(request, uid, token):
    protocol = 'https://' if request.is_secure() else 'http://'
    web_url = protocol + request.get_host()
    post_url = web_url + "/auth/users/activation/"
    post_data = {'uid': uid, 'token': token}
    result = requests.post(post_url, data = post_data)
    # content = result.text
    return HttpResponseRedirect("/signin/")
