from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Comment, Follow, Like, Post, UserProfile
from .serializers import (
    CommentSerializer,
    PostSerializer,
    UserRegisterSerializer,
    UserUpdateSerializer,
    UserSearchSerializer,
)

User = get_user_model()

class UserProfileDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        profile = get_object_or_404(UserProfile, user_id=pk)
        serializer = UserUpdateSerializer(profile, context={'request': request})
        return Response(serializer.data)


class UserListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSearchSerializer

    def get_queryset(self):
        users = User.objects.exclude(id=self.request.user.id)
        query = self.request.query_params.get('q', '')
        if query:
            users = users.filter(username__icontains=query)
        return users


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegisterSerializer


class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        following_ids = user.following.values_list('following_id', flat=True)
        return Post.objects.filter(
            user__in=list(following_ids) + [user.id]
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ToggleLikeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response(
                {'error': 'Post não encontrado.'}, status=status.HTTP_404_NOT_FOUND
            )

        like, created = Like.objects.get_or_create(user=request.user, post=post)
        if not created:
            like.delete() 
            return Response(
                {'message': 'Curtida removida.'}, status=status.HTTP_200_OK
            )

        return Response(
            {'message': 'Post curtido com sucesso.'},
            status=status.HTTP_201_CREATED,
        )


class CommentCreateView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        post_id = self.kwargs.get('pk')
        post = Post.objects.get(pk=post_id)
        serializer.save(user=self.request.user, post=post)


class FollowToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        if request.user.id == int(pk):
            return Response(
                {'error': 'Você não pode seguir a si mesmo.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            target_user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {'error': 'Usuário não encontrado.'}, status=status.HTTP_404_NOT_FOUND
            )

        follow, created = Follow.objects.get_or_create(
            follower=request.user, following=target_user
        )
        
        if not created:
            follow.delete()
            is_following = False
            message = 'Deixou de seguir o usuário.'
        else:
            is_following = True
            message = 'Agora você está seguindo este usuário.'

        # esse codigo é importante que faz a Conta quantos seguidores o usuário alvo possui agora
        followers_count = Follow.objects.filter(following=target_user).count()

        return Response(
            {
                'message': message,
                'is_following': is_following,
                'followers_count': followers_count
            },
            status=status.HTTP_200_OK,
        )


class UserUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserUpdateSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        serializer = UserUpdateSerializer(
            profile, 
            data=request.data, 
            partial=True, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        print("Erros do Serializer:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FollowersListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSearchSerializer

    def get_queryset(self):
        user_pk = self.kwargs.get('pk')
        target_user = get_object_or_404(User, pk=user_pk)
        # Pega todos os usuários que seguem o 'target_user'
        follower_ids = target_user.followers.values_list('follower_id', flat=True)
        return User.objects.filter(id__in=follower_ids)


class FollowingListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSearchSerializer

    def get_queryset(self):
        user_pk = self.kwargs.get('pk')
        target_user = get_object_or_404(User, pk=user_pk)
        # Pega todos os usuários que o 'target_user' está seguindo
        following_ids = target_user.following.values_list('following_id', flat=True)
        return User.objects.filter(id__in=following_ids)