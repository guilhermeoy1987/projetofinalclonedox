from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    # colocados os mesmos nomes  que estais nos models.py
    list_display = ('autor', 'conteudo', 'data_criacao')
    list_filter = ('autor', 'data_criacao')
