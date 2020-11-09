from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "project_name",
            "client",
            "location",
            "start_date",
            "end_date",
            "department",
        ]