from rest_framework import viewsets
from .models import Post
from .serializers import PostSerializer
from accounts.models import Follow

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # codigos importantes o que esta codigo faz Pega as listas de IDs de quem o usuário segue
        seguidos = Follow.objects.filter(seguidor=self.request.user).values_list('seguido', flat=True)
        # Retorna apenas os posts desses seguidos (ou os próprios posts do usuário)
        return Post.objects.filter(autor__id__in=seguidos) | Post.objects.filter(autor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(autor=self.request.user)
