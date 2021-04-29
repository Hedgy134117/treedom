from django.urls import path
from . import views

urlpatterns = [
    path("trees/", views.TreeList.as_view(), name="tree-list"),
    path("trees/<int:treeId>/", views.TreeDetail.as_view(), name="tree-detail"),
    path(
        "trees/<int:treeId>/<int:nodeId>/",
        views.NodeDetail.as_view(),
        name="node-detail",
    ),
    path("void-trees/", views.VoidTreeList.as_view(), name="void-tree-list"),
    path(
        "void-trees/<int:treeId>/",
        views.VoidTreeDetail.as_view(),
        name="void-tree-detail",
    ),
    path(
        "void-trees/<int:treeId>/<int:nodeId>/",
        views.VoidNodeDetail.as_view(),
        name="void-node-detail",
    ),
]
