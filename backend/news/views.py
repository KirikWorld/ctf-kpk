from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from .models import News
from rest_framework.status import (HTTP_405_METHOD_NOT_ALLOWED)


class ListNews(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        news = {new.pk: {"title": new.title, "description": new.description, "preview": new.preview if new.preview else "", "date": new.created_at} for new in News.objects.all()}
        return Response(news)

    def post(self, request):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)

    def head(self, request):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)

    def options(self, request):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)