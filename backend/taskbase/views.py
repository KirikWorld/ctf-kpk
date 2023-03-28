# from django.shortcuts import render
from taskbase.models import Task, TeamsTasks

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.contrib.auth.models import User
from .models import Task, Category, Daily
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
                    if request.data.get("title")==task.title:
                        if not task.solves_by.filter(username=current_user):
                            current_user.points += task.costs
                            task.solves_by.add(current_user)
                            if task.costs > 7: task.costs -= 7
                            task.save()
                            current_user.save()
                            return Response({"ur_points": current_user.points})
        return Response("Something wents wrong")

    def head(self, request):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)

    def options(self, request):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)
    
    
class ListCat(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cats = {cat.pk :{"category": cat.title, "checked": "false"} for cat in Category.objects.all()}
        return Response(cats)

    def post(self, request):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)

    def head(self, request):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)

    def options(self, request):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)


class DailyList(APIView):
    authentication_classes = [authentication.TokenAuthentication]  # authentication.TokenAuthentication
    permission_classes = [permissions.IsAuthenticated]  # permissions.IsAuthenticated

    def get(self, request):
        task = Daily.objects.last()
        current_user = request.user
        return Response({"description": task.description, "costs": task.costs, "solved": str(task.solves_by.filter(username=current_user).first())})

    def post(self, request):
        current_user = request.user
        flag = request.data.get("flag")
        if flag:
            t = Daily.objects.last().flag==flag
            if t:
                task = Daily.objects.last()
                if not task.solves_by.filter(username=current_user):
                    current_user.points += task.costs
                    task.solves_by.add(current_user)
                    if task.costs > 7: task.costs -= 7
                    task.save()
                    current_user.save()
                    return Response({"ur_points": current_user.points})
        return Response("Something wents wrong")

    def head(self, request):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)

    def options(self, request):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)
    