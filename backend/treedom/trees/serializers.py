from django.db.models.fields import BooleanField
from rest_framework import serializers
from .models import Tree, Node, VoidTree, VoidNode


# https://stackoverflow.com/a/27236783/11780944
class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class NodeSerializer(serializers.ModelSerializer):
    node_set = RecursiveField(many=True, read_only=True)

    class Meta:
        model = Node
        fields = ["id", "tree", "parent", "name", "desc", "price", "active", "node_set"]


class TreeSerializer(serializers.ModelSerializer):
    node_set = NodeSerializer(many=True, read_only=True)

    class Meta:
        model = Tree
        fields = ["id", "name", "user", "creator", "node_set"]


class VoidNodeSerializer(serializers.ModelSerializer):
    voidnode_set = RecursiveField(many=True, read_only=True)

    class Meta:
        model = VoidNode
        fields = "__all__"


class VoidTreeSerializer(serializers.ModelSerializer):
    voidnode_set = VoidNodeSerializer(many=True, read_only=True)

    class Meta:
        model = VoidTree
        fields = ["id", "name", "voidnode_set"]