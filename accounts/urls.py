from django.urls import path

from . import views

urlpatterns = [
    path("dashboard", views.index, name="indexuser"),
    path("postuser", views.postUser, name="postUser"),
    path("userjson", views.getdata, name="getUsers"),
    path("getuser", views.getUser, name="getUsers"),
    path("edituser", views.editUser, name="getUsers"),
    path("deleteuser", views.deleteUser, name="getUsers"),
    path("login", views.loginuser, name="login"),
    path("logout", views.userlogout, name="logout"),
    path("testlogic", views.testlogin),
]
