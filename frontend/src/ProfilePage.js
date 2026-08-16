import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProfilePage() {
  const { id } = useParams(); // codigo importante que Pega o ID dinâmico da URL (exemplos: /profile/2 -> id = 2)
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const token = localStorage.getItem('access');
        
        // 1.api que das importante saber  Busca os dados do perfil do usuário na API do backend
        const profileResponse = await axios.get(`http://127.0.0.1:8000/api/users/${id}/profile/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(profileResponse.data);

        // 2. APi dinamica api atraves do link Busca os posts específicos desse usuário
        const postsResponse = await axios.get(`http://127.0.0.1:8000/api/posts/?user=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
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
  }, [id]); // esse é o codigo que esse codigo Executa novamente sempre que o ID na URL mudar

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando perfil...</p>;
  }

  if (!profileData) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Usuário não encontrado.</p>;
  }

  return (
    <div className="profile-container">
      {/*eses é  o Cabeçalho do Perfil */}
      <div className="profile-header">
        <h2>{profileData.username}</h2>
        <p>{profileData.bio || "@{profileData.username}"}</p>
        <p>📍 {profileData.location || "Ribeirão Preto, SP"}</p>
        
        <div className="profile-stats">
          <span><strong>{profileData.following_count || 0}</strong> Following</span>
          <span><strong>{profileData.followers_count || 0}</strong> Followers</span>
        </div>
      </div>

      {/* aca aparece a  Lista de Posts do Usuário */}
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