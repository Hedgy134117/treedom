from django.urls import path
from . import views

urlpatterns = [
    path("users/", views.UserList.as_view(), name="user-list"),
    path("users/<int:id>/", views.UserDetail.as_view(), name="user-detail"),
    path("login/", views.UserLogin.as_view(), name="user-login"),
]