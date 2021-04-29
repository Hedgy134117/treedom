from rest_framework import permissions
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import (
    TreeSerializer,
    NodeSerializer,
    VoidTreeSerializer,
    VoidNodeSerializer,
)
from .models import Tree, Node, VoidTree, VoidNode

import pprint


class TreeList(APIView):
    """
    Get all trees, or create a new one.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """ Get all trees """
        trees = Tree.objects.all()
        serializer = TreeSerializer(instance=trees, many=True)

        # Remove the node_set, not necessary to see on the list
        for tree in serializer.data:
            del tree["node_set"]

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """ Create a tree """
        serializer = TreeSerializer(data=request.data)
        serializer.initial_data["creator"] = request.user.id
        print(serializer.initial_data)
        if serializer.is_valid():
            serializer.save()
            Node.objects.create(
                tree=Tree.objects.get(id=serializer.data["id"]), desc="Root"
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TreeDetail(APIView):
    """
    Get the details about a tree, edit a tree, or add a node to a tree
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, treeId):
        """ Get details about a tree """
        tree = Tree.objects.get(id=treeId)
        serializer = TreeSerializer(instance=tree)

        # Remove children from repeating
        childNodes = []
        for node in serializer.data["node_set"]:
            if node["parent"] != None:
                childNodes.append(node)

        for node in childNodes:
            serializer.data["node_set"].remove(node)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, treeId):
        """ Edit details about a tree """
        tree = Tree.objects.get(id=treeId)
        serializer = TreeSerializer(instance=tree, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, treeId):
        """ Add a node to a tree """
        tree = Tree.objects.get(id=treeId)
        serializer = NodeSerializer(data=request.data)
        serializer.initial_data["tree"] = tree.id
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NodeDetail(APIView):
    """
    Get the details about a node, edit a node, or delete a node
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, treeId, nodeId):
        """ Get details about a node """
        node = Node.objects.get(id=nodeId)
        serializer = NodeSerializer(instance=node)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, treeId, nodeId):
        """ Edit a node """
        node = Node.objects.get(id=nodeId)
        serializer = NodeSerializer(instance=node, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, treeId, nodeId):
        """ Delete a node """
        node = Node.objects.get(id=nodeId)
        node.delete()
        return Response(None, status=status.HTTP_204_NO_CONTENT)


class VoidTreeList(APIView):
    """
    Get all VOID trees, or create a new one.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """ Get all VOID trees """
        trees = VoidTree.objects.all()
        serializer = VoidTreeSerializer(instance=trees, many=True)

        # Remove the node_set, not necessary to see on the list
        for tree in serializer.data:
            del tree["voidnode_set"]

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """ Create a VOID tree """
        serializer = VoidTreeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            VoidNode.objects.create(
                tree=VoidTree.objects.get(id=serializer.data["id"]), name="Root"
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VoidTreeDetail(APIView):
    """
    Get the details about a VOID tree, edit a VOID tree, or add a VOID node to a VOID tree
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, treeId):
        """ Get details about a VOID tree """
        tree = VoidTree.objects.get(id=treeId)
        serializer = VoidTreeSerializer(instance=tree)

        # Remove children from repeating
        childNodes = []
        for node in serializer.data["voidnode_set"]:
            print(node)
            if node["parent"] != None:
                childNodes.append(node)

        for node in childNodes:
            serializer.data["voidnode_set"].remove(node)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, treeId):
        """ Edit details about a VOID tree """
        tree = VoidTree.objects.get(id=treeId)
        serializer = VoidTreeSerializer(instance=tree, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, treeId):
        """ Add a VOID node to a VOID tree """
        tree = VoidTree.objects.get(id=treeId)
        serializer = VoidNodeSerializer(data=request.data)
        serializer.initial_data["tree"] = tree.id
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VoidNodeDetail(APIView):
    """
    Get the details about a VOID node, edit a VOID node, or delete a VOID node
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, treeId, nodeId):
        """ Get details about a VOID node """
        node = VoidNode.objects.get(id=nodeId)
        serializer = VoidNodeSerializer(instance=node)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, treeId, nodeId):
        """ Edit a VOID node """
        node = VoidNode.objects.get(id=nodeId)
        serializer = VoidNodeSerializer(instance=node, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, treeId, nodeId):
        """ Delete a VOID node """
        node = VoidNode.objects.get(id=nodeId)
        node.delete()
        return Response(None, status=status.HTTP_204_NO_CONTENT)