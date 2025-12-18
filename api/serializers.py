from rest_framework import serializers
from .models import User,Post


class UserSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(
        format="%d-%m-%Y %H:%M:%S",
        read_only=True
    )
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            "password":{"write_only": True},
            "role" : {"read_only":True}
        }


class PostSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'content',
            'author',
            'status',
            'created_at',
            'updated_at'
        ]
