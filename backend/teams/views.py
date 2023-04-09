from users.models import Teams, User
from django.http.response import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework.status import (HTTP_405_METHOD_NOT_ALLOWED)
from django.db import IntegrityError
import json
import hashlib
import random


class TeamsView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.team:
            return JsonResponse({"team": user.team.title, "team_points": user.team.title, "invintation": user.team.invintation, "members": {member.pk: {"username": member.username, "points": member.points}
                                                                                                                                            for member in User.objects.filter(team=user.team.id)}})
        return JsonResponse(status=HTTP_405_METHOD_NOT_ALLOWED, data={"error": "У тебя нет команды"})

    def post(self, request):
        user = request.user
        if not user.team:
            rbody = json.loads(request.body)
            if not rbody.get('title'):
                return JsonResponse(status=HTTP_405_METHOD_NOT_ALLOWED, data={"error": "Заполни название команды"})
            if not rbody.get('institution'):
                return JsonResponse(status=HTTP_405_METHOD_NOT_ALLOWED, data={"error": "Заполни название учебного заведения"})
            if rbody.get("max_members") < 1:
                return JsonResponse(status=HTTP_405_METHOD_NOT_ALLOWED, data={"error": "Недопустимое значение участников"})
            if rbody.get("max_members") > 5:
                return JsonResponse(status=HTTP_405_METHOD_NOT_ALLOWED, data={"error": "Недопустимое значение участников"})
            try:
                invintation = hashlib.pbkdf2_hmac(
                    "sha256",  # Используемый алгоритм хеширования
                    # Конвертирование в байты
                    rbody.get("title").encode("utf-8"),
                    bytes(random.randint(100, 10000)),  # Предоставление соли
                    150130,  # Рекомендуется использоваться по крайней мере 100000 итераций SHA-256
                    dklen=10  # длина derived key
                ).hex()
                newTeam = Teams.objects.create(title=rbody.get("title"), points=0, teamLead=user, institution=rbody.get(
                    "institution"), active=False, max_members=rbody.get("max_members"), invintation=invintation)
                user.team = newTeam
                user.save()
                newTeam.save()
            except IntegrityError as e:
                return JsonResponse(status=HTTP_405_METHOD_NOT_ALLOWED, data={"error": "Такая команда уже есть"})
            return JsonResponse({"success": "Успешно"})
        return JsonResponse(status=HTTP_405_METHOD_NOT_ALLOWED, data={"error": "У тебя есть команда"})

    def head(self, request):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)

    def options(self, request):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)


class TeamsInvintation(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.team:
            if request.GET.get("inv"):
                try:
                    team = Teams.objects.get(
                        invintation=request.GET.get("inv"))
                    member_count = User.objects.filter(team=team.id).count()
                    if member_count != team.max_members:
                        user.team = team
                        user.save()
                        return JsonResponse(data={"ok": "Успешно"}, safe=False)
                    else:
                        return JsonResponse(status=HTTP_405_METHOD_NOT_ALLOWED, data={"error": "В команде нет места"})
                except:
                    return JsonResponse(status=HTTP_405_METHOD_NOT_ALLOWED, data={"error": "Приглашение недействительно"})
        return JsonResponse(status=HTTP_405_METHOD_NOT_ALLOWED, data={"error": "У тебя есть команда"})

    def post(self, request):
        user = request.user
        if user.team:
            team = Teams.objects.get(id=user.team.id)
            if user == team.teamLead:
                team.invintation = hashlib.pbkdf2_hmac(
                    "sha256",  # Используемый алгоритм хеширования
                    user.team.title.encode("utf-8"),  # Конвертирование в байты
                    bytes(random.randint(100, 10000)),  # Предоставление соли
                    150130,  # Рекомендуется использоваться по крайней мере 100000 итераций SHA-256
                    dklen=10  # длина derived key
                ).hex()
                team.save()
                return JsonResponse(data={"invintation": team.invintation})
        return JsonResponse(status=HTTP_405_METHOD_NOT_ALLOWED, data={"error": "Вы не являетесь капитаном"})

    def head(self, request):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)

    def options(self, request):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)


class TeamsRanks(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return JsonResponse({team.pk: {"username": team.title, "points": team.points} for team in Teams.objects.order_by("-points") if team.active})
