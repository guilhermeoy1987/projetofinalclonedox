from django.db import models
from django.conf import settings

class Post(models.Model):
    autor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    conteudo = models.TextField(max_length=280) # Limite estilo Twitter
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-data_criacao'] #  las Posts  mais news en primeirissimo 

    def __str__(self):
        return f"{self.autor.username}: {self.conteudo[:20]}"