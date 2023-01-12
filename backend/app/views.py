from django.shortcuts import render


def index(request):
    return render(template_name="app/index.html", request=request)
