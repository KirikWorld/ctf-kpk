# from django.shortcuts import render
from taskbase.models import Task, TeamsTasks

# def index(request):
#     current_user = request.user
#     t = list(Task.objects.values())

#     if request.GET.get("flag"):
#         if Task.objects.filter(flag=request.GET.get("flag")):
#             for task in Task.objects.filter(flag=request.GET.get("flag")):
#                 if not task.solves_by.filter(username=current_user):
#                         current_user.points += task.costs
#                         task.solves_by.add(current_user)
#                         current_user.save()

#     return render(request, 'taskbase-home.html', context={'tasks': t, 'user': current_user})

# def teams(request):
#     current_user = request.user
#     current_user_team = request.user.team
#     t = list(TeamsTasks.objects.values())

#     if request.GET.get("flag"):
#         if TeamsTasks.objects.filter(flag=request.GET.get("flag")):
#             for task in TeamsTasks.objects.filter(flag=request.GET.get("flag")):
#                 if not task.solves_by.filter(title=current_user_team):
#                         current_user_team.points += task.costs
#                         task.solves_by.add(current_user_team)
#                         current_user_team.save()

#     return render(request, 'teams-home.html', context={'tasks': t, 'user': current_user})

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.contrib.auth.models import User
from .models import Task
from rest_framework.status import (HTTP_405_METHOD_NOT_ALLOWED)
from pathlib import Path


class ListTasks(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        current_user = request.user
        tasks = {task.pk: {"title": task.title, "description": task.description if task.description else "",
                           "costs": task.costs, "file": str(task.file) if task.file else "", "solved": str(task.solves_by.filter(username=current_user).first()), "category": str(task.category)} for task in Task.objects.all()}
        return Response(tasks)

    def post(self, request):
        current_user = request.user
        flag = request.data.get("flag")
        if flag:
            t = Task.objects.filter(flag=flag)
            if t:
                for task in t:
                    if not task.solves_by.filter(username=current_user):
                        current_user.points += task.costs
                        task.solves_by.add(current_user)
                        if task.costs > 7: task.costs -= 7
                        task.save()
                        current_user.save()
                        return Response({"ur_points": current_user.points})
        return Response("Something wents wrong")

    def head(self, requser):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)

    def options(self, requser):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)
