from django.db import models
from django.db.models.fields import related

# Create your models here.
class Tree(models.Model):
    name = models.CharField(max_length=256)
    user = models.ForeignKey("authentication.User", models.CASCADE, related_name="user")
    creator = models.ForeignKey(
        "authentication.User", models.CASCADE, related_name="creator"
    )

    def __str__(self):
        return f"{self.creator} -> {self.user}: {self.name}"


class Node(models.Model):
    tree = models.ForeignKey("trees.Tree", models.CASCADE)
    name = models.CharField(max_length=256, blank=True)
    desc = models.TextField()
    price = models.CharField(max_length=256, blank=True)
    active = models.BooleanField(default=False)
    parent = models.ForeignKey("trees.Node", models.CASCADE, null=True)

    def __str__(self):
        return f"{self.tree} -> {self.name}"
