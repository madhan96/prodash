from django.shortcuts import render
from .forms import ProjectForm, TaskForm, SequenceForm, ShotForm, MultiTestform
from .serializers import ProjectSerializer
from django.http import HttpResponse, JsonResponse
from .models import Project
import json
from django.views.decorators.csrf import ensure_csrf_cookie


# Create your views here.
@ensure_csrf_cookie
def getProjectDashboard(request):
    form = ProjectForm()
    return render(request, "projectmain.html", {"form": form})


def getTestDashboard(request):
    form = ProjectForm()
    if request.method == "POST":
        form = ProjectForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse("Thank you...")
        else:
            return render(request, "common.html", {"form": form})
    return render(request, "common.html", {"form": form})


def projectDetails(request):
    if request.method == "POST":
        form = ProjectForm(request.POST)
        if form.is_valid():
            form.save()
            data = ProjectSerializer(Project.objects.all(), many=True).data
            return JsonResponse({"result": data}, safe=False)
        else:
            data = form.errors.as_json()
            return JsonResponse({"errors": data}, status=400, safe=False)

    data = ProjectSerializer(Project.objects.all(), many=True).data
    return JsonResponse({"result": data}, safe=False)


def editProjectdetails(request):

    if request.method == "POST":

        json_data = json.loads(str(request.body, encoding="utf-8"))
        userid = json_data["userid"]
        del json_data["userid"]
        Project.objects.filter(pk=userid).update(**json_data)
        data = ProjectSerializer(Project.objects.all(), many=True).data
        return JsonResponse({"result": data}, safe=False)

    return JsonResponse({"result": "success"})


def deleteProject(request):
    if request.method == "POST":
        json_data = json.loads(str(request.body, encoding="utf-8"))
        Project.objects.get(pk=json_data["userid"]).delete()
        data = ProjectSerializer(Project.objects.all(), many=True).data
        return JsonResponse({"result": data})

    return JsonResponse({"result": "success"})


def testSequenceForm(request):
    form = SequenceForm()
    if request.method == "POST":
        form = SequenceForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse("Thank you...")
        else:
            return render(request, "common.html", {"form": form})
    return render(request, "common.html", {"form": form})


def testShotForm(request):
    form = ShotForm()
    if request.method == "POST":
        form = ShotForm(request.POST)
        if form.is_valid():
            print(request.POST.dict())
            form.save()
            return HttpResponse("Thank you...")
        else:
            return render(request, "common.html", {"form": form})
    return render(request, "common.html", {"form": form})


def testTaskForm(request):
    form = MultiTestform()
    if request.method == "POST":
        form = MultiTestform(request.POST)
        if form.is_valid():
            print(request.POST.dict())
            form.save()
            return HttpResponse("Thank you...")
        else:
            return render(request, "common.html", {"form": form})
    return render(request, "common.html", {"form": form})
