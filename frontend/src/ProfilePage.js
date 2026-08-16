import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from './services/api';

function ProfilePage() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const token = localStorage.getItem('access');
        
        // Requisições utilizando a instância 'api' e rotas relativas
        // O uso do Promise.all agiliza o carregamento dos dados
        const [profileResponse, postsResponse] = await Promise.all([
          api.get(`users/${id}/profile/`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get(`posts/?user=${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setProfileData(profileResponse.data);
        setUserPosts(postsResponse.data);

      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfileAndPosts();
    }
  }, [id]);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando perfil...</p>;
  }

  if (!profileData) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Usuário não encontrado.</p>;
  }

  return (
    <div className="profile-container">
      {/* Cabeçalho do Perfil */}
      <div className="profile-header">
        <h2>{profileData.username}</h2>
        <p>{profileData.bio || `@${profileData.username}`}</p>
        <p>📍 {profileData.location || "Ribeirão Preto, SP"}</p>
        
        <div className="profile-stats">
          <span><strong>{profileData.following_count || 0}</strong> Following</span>
          <span><strong>{profileData.followers_count || 0}</strong> Followers</span>
        </div>
      </div>

      {/* mostra Lista de Posts do Usuário */}
      <div className="user-posts-section">
        <h3>Posts</h3>
        {userPosts.length === 0 ? (
          <p>Este usuário ainda não fez nenhum post.</p>
        ) : (
          userPosts.map((post) => (
            <div key={post.id} className="post-item">
              <p>{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfilePage;