from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # este codigo o que faz:ele  garantse quse o paineeis  de adminastrodora exiba seus campos customizadas
    list_display = ('username', 'email', 'is_staff')