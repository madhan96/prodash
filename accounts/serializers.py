from rest_framework import serializers

from django.contrib.auth import get_user_model
from .models import UserType

User = get_user_model()

roles = dict(
    [
        ("ARTIST", "artist"),
        ("PRODUCTION", "production"),
        ("PRO-CO", "project co-ordinator"),
        ("PRO-TL", "project lead"),
        ("PRO-SUP", "project supervisor"),
        ("IT-SUPPORT", "it-support"),
    ]
)


class UserTypeField(serializers.Field):
    def to_representation(self, value):
        usertype = value.usertype
        ret = {}

        if value.usertype is not None:
            ret = roles[usertype.type]

        return ret

    def to_internal_value(self, data):
        ret = {"usertype": data["usertype"]}
        return ret


class UserSerializer(serializers.ModelSerializer):
    usertype = UserTypeField(source="*")

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "dept",
            "designation",
            "doj",
            "igene_id",
            "usertype",
        ]