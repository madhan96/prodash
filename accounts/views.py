from django.shortcuts import render

# Create your views here.

from django.shortcuts import render, redirect
from datetime import date
from django.http import HttpResponse, JsonResponse
from .serializers import UserSerializer
from django.views.decorators.csrf import ensure_csrf_cookie
from accounts.models import UserType, get_usertype
from django.contrib.auth import get_user_model
from accounts.forms import UserLoginForm
from django.contrib.auth import logout, login
from django.contrib.auth.decorators import login_required
from .utils import allowed_users
import json

User = get_user_model()

# Create your views here.
def getdata(request):
    if request.method == "POST":
        print(request)
        return JsonResponse({"result": "success"})

    data = UserSerializer(User.objects.all(), many=True).data

    return JsonResponse(data, safe=False)


def postUser(request):
    if request.method == "POST":

        json_data = json.loads(str(request.body, encoding="utf-8"))
        json_data["usertype"] = get_usertype(json_data["usertype"])

        password = json_data["password"]
        del json_data["password"]
        user = User(**json_data)
        user.set_password(password)
        user.save()
        data = UserSerializer(User.objects.all(), many=True).data
        return JsonResponse(data, safe=False)

    return JsonResponse({"result": "success"})


def editUser(request):
    if request.method == "POST":

        json_data = json.loads(str(request.body, encoding="utf-8"))
        json_data["usertype"] = get_usertype(json_data["usertype"])
        userid = json_data["userid"]
        del json_data["userid"]
        User.objects.filter(pk=userid).update(**json_data)
        data = UserSerializer(User.objects.all(), many=True).data
        return JsonResponse(data, safe=False)

    return JsonResponse({"result": "success"})


def getUser(request):
    if request.method == "POST":

        json_data = json.loads(str(request.body, encoding="utf-8"))

        data = UserSerializer(User.objects.get(pk=json_data["userid"])).data
        return JsonResponse(data, safe=False)

    return JsonResponse({"result": "success"})


def deleteUser(request):
    if request.method == "POST":

        json_data = json.loads(str(request.body, encoding="utf-8"))

        User.objects.get(pk=json_data["userid"]).delete()
        data = UserSerializer(User.objects.all(), many=True).data
        return JsonResponse(data, safe=False)

    return JsonResponse({"result": "success"})


@ensure_csrf_cookie
@login_required(login_url="login")
def index(request):
    type = request.user.usertype.type
    if type == "PRODUCTION":
        return render(request, "projectPlan.html")
    if type == "ARTIST":
        return render(request, "index.html")
    return render(request, "index.html")


def loginuser(request):
    if request.method == "POST":
        form = UserLoginForm(request=request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            print(user.usertype)
            login(request, user)
            print("hereaftervalid")
            return redirect("indexuser")  # user is redirected to dashboard
        else:
            print(form.errors)
    else:
        form = UserLoginForm()

    return render(request, "login.html", {"form": form})


def userlogout(request):
    logout(request)
    return redirect("login")


@login_required(login_url="login")
@allowed_users(allowed_roles=["PRODUCTION"])
def testlogin(request):
    return render(request, "indexproduction.html")


# <option value="PRODUCTION">production</option>
# <option value="PRO-SUP">project supervisor</option>
# <option value="PRO-TL">project lead</option>
# <option value="PRO-CO">project co-ordinator</option>
# <option value="ARTIST">artist</option>
# <option value="IT-SUPPORT">it-support</option>

