from django.urls import path

from . import views

urlpatterns = [
    path("dashboard", views.getProjectDashboard, name="project_dashboard"),
    path("projectsdata", views.projectDetails, name="project_addprojects"),
    path("test", views.getTestDashboard, name="project_test"),
    path("testseq", views.testSequenceForm, name="project_test_seq"),
    path("testshot", views.testShotForm, name="project_test_shot"),
    path("testtask", views.testTaskForm, name="project_test_shot"),
]
