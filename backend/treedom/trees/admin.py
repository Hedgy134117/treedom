from django.contrib import admin
from .models import Tree, Node, VoidTree, VoidNode

# Register your models here.
admin.site.register(Tree)
admin.site.register(Node)
admin.site.register(VoidTree)
admin.site.register(VoidNode)