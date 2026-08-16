from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Comment, Like, Post, UserProfile, Follow
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class UserProfileDetailView(APIView):
    def get(self, request, pk):
        # 1. Pega o perfil vinculado ao usuário cujo ID (pk) foi passado na URL (/profile/3 -> pk=3)
        profile = get_object_or_404(UserProfile, user_id=pk)
        
        # 2. Serializa os dados daquele perfil específico
        serializer = UserUpdateSerializer(profile, context={'request': request})
        return Response(serializer.data)
    
User = get_user_model()


# 1. Serializador para o Cadastro de Novos Usuários via Front-end
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        return user


# 2. Serializador de Comentários
class CommentSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Comment
        fields = ['id', 'user', 'username', 'content', 'created_at']
        read_only_fields = ['user']


# 3. Serializador de Posts
class PostSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    comments = CommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'user',
            'username',
            'content',
            'created_at',
            'comments',
            'likes_count',
            'is_liked_by_user',
        ]
        read_only_fields = ['user']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

# esse é o Código da página profile atualizado para incluir is_following, followers_count e following_count
class UserUpdateSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    location = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    avatar = serializers.ImageField(required=False, allow_null=True)
    banner = serializers.ImageField(required=False, allow_null=True)

# Adicionar codgio do   ID do usuário dono do perfil para o Front-end conseguir ler
    id = serializers.ReadOnlyField(source='user.id')
    username = serializers.ReadOnlyField(source='user.username')
    
    is_following = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        
        fields = ['id','username', 'bio', 'location', 'avatar', 'banner', 'is_following', 'followers_count', 'following_count']

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Verifica se o usuário logado segue o usuário dono deste perfil
            return Follow.objects.filter(follower=request.user, following=obj.user).exists()
        return False

    def get_followers_count(self, obj):
        # esse caodigo faz Conta quantos seguidores o dono deste perfil tem
        return Follow.objects.filter(following=obj.user).count()

    def get_following_count(self, obj):
        # codigo que faz a Contd a quantos usuários o dono deste perfil está seguindo
        return Follow.objects.filter(follower=obj.user).count()


class UserSearchSerializer(serializers.ModelSerializer):
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'is_following']

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Follow.objects.filter(follower=request.user, following=obj).exists()
        return False