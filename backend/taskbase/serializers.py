from rest_framework import serializers


class TaskSerializer(serializers.Serializer):
    flag = serializers.CharField(verbose_name="Флаг", blank=False, max_length=120, help_text="По умолчанию флаг оборачивается в 'ctfRoom{}'")