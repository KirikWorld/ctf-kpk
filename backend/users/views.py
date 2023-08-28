import json
from users.models import User
from rest_framework import authentication
import requests
from rest_framework import permissions
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponseRedirect, JsonResponse
from rest_framework.status import (HTTP_405_METHOD_NOT_ALLOWED)
from rest_framework.authtoken.models import Token
import base64
import urllib
from django.core.mail import EmailMessage
from django.http import HttpResponseRedirect
import django.contrib.auth.password_validation as validators

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
    result = requests.post(post_url, data=post_data)
    # content = result.text
    return HttpResponseRedirect("/signin/")


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def UserResetPassword(request):
    try:
        rbody = json.loads(request.body)
        user = User.objects.filter(username=rbody.get(
            "username"), email=rbody.get("email")).first()
        validationError = False
        if user:
            token = Token.objects.get_or_create(user=user)
            try:
                validators.validate_password(rbody.get('password'))
            except Exception as e:
                validationError = list(e)[0]
            if not validationError:
                password = urllib.parse.urlencode(
                    {"user": base64.b64encode(bytes(rbody.get("password"), 'utf-8'))})
                if request.is_secure():
                    url = f"https://{request.get_host()}/api/users/password_reset/{token[0]}/{password.replace('user=', '')}"
                else:
                    url = f"http://{request.get_host()}/api/users/password_reset/{token[0]}/{password.replace('user=', '')}"

                emailPayload = f'Для подтверждения смены пароля перейдите по ссылке: {url}.\nЕсли вы не знаете почему вам пришло это письмо, игнорируйте его.'
                email = EmailMessage('Восстановление пароля на ctf-kpk.ru',
                                    body=emailPayload, to=[user.email])
                email.send()
        else:
            validationError="Неверная почта или логин"
    except:
        return JsonResponse(data={"error": "Неверный запрос"}, status=HTTP_405_METHOD_NOT_ALLOWED)
    if validationError:
        return JsonResponse(data={"error": validationError}, status=HTTP_405_METHOD_NOT_ALLOWED)
    return JsonResponse({"success": "Письмо отправлено на почту"})


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def UserResetPasswordConfirm(request, token, password):
    try:
        token = Token.objects.get(key=token)
        user = token.user
        password = str(base64.b64decode(
            urllib.parse.unquote(password)), 'utf-8')
        user.set_password(password)
        user.save()
        token.delete()
    except:
        return JsonResponse(data={"error": "Неверный запрос"}, status=HTTP_405_METHOD_NOT_ALLOWED)
    return HttpResponseRedirect('/signin/')
    # return JsonResponse({"success": "Пароль изменен успешно"})
