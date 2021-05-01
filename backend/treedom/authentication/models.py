from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    inVoid = models.BooleanField(default=False)
    voidAdmin = models.BooleanField(default=False)
    voidPoints = models.IntegerField(default=0)
    pass