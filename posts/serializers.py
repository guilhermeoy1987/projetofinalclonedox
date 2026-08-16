from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    autor = serializers.ReadOnlyField(source='autor.username')

    class Meta:
        model = Post
        fields = ['id', 'autor', 'conteudo', 'data_criacao']