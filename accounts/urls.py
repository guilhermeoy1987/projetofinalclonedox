from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.views.decorators.csrf import csrf_exempt
from .views import (
    RegisterView, PostListCreateView, ToggleLikeView, 
    CommentCreateView, FollowToggleView, UserUpdateView, UserListView,
    UserProfileDetailView, FollowersListView, FollowingListView # <--- 1. Importe as novas views aqui
)

urlpatterns = [
    path('login/', csrf_exempt(TokenObtainPairView.as_view()), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('register/', RegisterView.as_view(), name='register'),
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/like/', ToggleLikeView.as_view(), name='toggle-like'),
    path('posts/<int:pk>/comments/', CommentCreateView.as_view(), name='comment-create'),
    path('users/<int:pk>/follow/', FollowToggleView.as_view(), name='follow-toggle'),
    path('users/update/', UserUpdateView.as_view(), name='user-update'),
    path('users/<int:pk>/profile/', UserProfileDetailView.as_view()),
    path('users/', UserListView.as_view(), name='user-list'),

    # <--- 2. Adicione as rotas para listar seguidores e quem o usuário segue
    path('users/<int:pk>/followers/', FollowersListView.as_view(), name='user-followers'),
    path('users/<int:pk>/following/', FollowingListView.as_view(), name='user-following'),
]