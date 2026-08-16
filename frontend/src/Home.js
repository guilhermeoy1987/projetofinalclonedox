import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TweetModal from './TweetModal'; 
import CommentModal from './CommentModal'; 

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentingPost, setCommentingPost] = useState(null);

  const fetchPosts = async () => {
    console.log("🔥 Rodando a busca de posts na pagina home!");
    try {
      const token = localStorage.getItem('access');
      console.log("🔑 Token recuperado com sucesso:", token);
      
      if (!token) {
        console.log("❌ Token nao encontrado, redirecionando para o login");
        navigate('/login');
        return;
      }

      console.log("🌐 Fazendo requisicao para a API de posts...");
      const response = await axios.get('http://127.0.0.1:8000/api/posts/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("✅ Dados recebidos da API com sucesso:", response.data);

      // codigo ordem crescente recente para mais antigo.
      const sortedPosts = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPosts(sortedPosts); 
    } catch (error) {
      console.error("❌ Erro ao buscar os posts na api:", error);
      if (error.response && error.response.status === 401) {
          localStorage.clear();
          navigate('/login');
      }
    }
  };

  const handlePostCreated = () => {
    fetchPosts();
  };

  useEffect(() => {
    console.log("🚀 Componente home montado, chamando a funcao de buscar posts...");
    fetchPosts();
  }, []);

  const handleClick = (item) => {
    if (item === 'Home') {
      fetchPosts();
    } else if (item === 'Tweet') {
      setIsModalOpen(true);
    } else {
      console.log(`Voce clicou em: ${item}`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.post(`http://127.0.0.1:8000/api/posts/${postId}/like/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchPosts();
    } catch (error) {
      console.error("Erro ao curtir o post:", error);
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  return (
    <div className="home-container">
      <nav className="sidebar">
        <div className="logo">🐦</div>
        <ul>
          <li onClick={() => handleClick('Home')}>Home</li>
          <li onClick={() => navigate('/profile')}>Profile</li>
          <li onClick={() => navigate('/follow')}>Follow</li>
          <li onClick={handleLogout} className="logout-item">Logout</li>
        </ul>
        <button className="tweet-button" onClick={() => handleClick('Tweet')}>Tweet</button>
      </nav>

      <main className="timeline">
        <h2>For you</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post-card">
               <div className="post-main">
                <div className="post-avatar">👤</div>
                <div className="post-content-area">
                  <div className="post-header-info">
                    <strong 
                      className="post-username" 
                      onClick={() => navigate(post.user ? `/profile/${post.user}` : '/profile')}
                      style={{ cursor: 'pointer' }}
                    >
                      {post.username || "Usuario"}
                    </strong> 
                    <span className="post-time">
                      {post.created_at ? new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div className="post-text">{post.content}</div>
                </div>
              </div>

              {/*codigo para a area de comentar do Post */}
              {post.comments && post.comments.length > 0 && (
                <div className="comments-section" style={{ marginTop: '12px', paddingLeft: '40px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="comment-item" style={{ fontSize: '14px', marginBottom: '6px' }}>
                      <strong>{comment.username || "Usuario"}: </strong>
                      <span>{comment.content}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="post-actions" style={{ marginTop: '10px' }}>
                <button onClick={() => handleLike(post.id)} className="action-btn like-btn">
                  ❤️ <span>{post.likes_count || 0}</span>
                </button>
                <button onClick={() => setCommentingPost(post)} className="action-btn comment-btn">
                  💬 Comentar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="post-card">Nenhum tweet encontrado... Faça o primeiro!</div>
        )}
      </main>

      <aside className="widgets">
        <input type="text" placeholder="Search" className="search-input" />
        <div className="whats-happening">What's happening</div>
      </aside>

      {isModalOpen && <TweetModal onClose={closeModal} onPostCreated={handlePostCreated} />}

      {commentingPost && (
        <CommentModal 
          post={commentingPost} 
          onClose={() => setCommentingPost(null)} 
          onCommentCreated={fetchPosts} 
        />
      )}
    </div>
  );
}

export default Home;