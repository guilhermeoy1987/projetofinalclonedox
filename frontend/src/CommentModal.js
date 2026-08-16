import React, { useState } from 'react';
import axios from 'axios';
import './CommentModal.css';

function CommentModal({ post, onClose, onCommentCreated }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('access');
      
      await axios.post(`http://127.0.0.1:8000/api/posts/${post.id}/comments/`, 
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setLoading(false);
      onCommentCreated();
      onClose();          
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      setLoading(false);
      alert("Erro ao enviar comentário.");
    }
  };

  return (
    <div className="comment-modal-overlay">
      <div className="comment-modal-content">
        
        {/* Botão Fechar */}
        <div className="comment-modal-header">
          <button onClick={onClose} className="comment-close-btn">✕</button>
        </div>

        {/* Post original sendo respondido */}
        <div className="comment-original-post">
          <div className="comment-thread-line-container">
            <div className="comment-avatar-placeholder">👤</div>
            <div className="comment-thread-line"></div>
          </div>
          <div>
            <div className="comment-user-info">
              <strong>{post.username || "Usuário"}</strong> 
              <span className="comment-username-handle">@{post.username || "usuario"}</span>
            </div>
            <div className="comment-post-text">{post.content}</div>
          </div>
        </div>

        {/* Indicador de "Replying to" */}
        <div className="comment-replying-to">
          Replying to <span>@{post.username || "usuario"}</span>
        </div>

        {/* Input de Resposta */}
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="comment-avatar-placeholder">👤</div>
          <div className="comment-input-area">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Post your reply"
              rows={3}
              className="comment-textarea"
            />
            
            <div className="comment-form-footer">
              <div></div>
              <button 
                type="submit" 
                disabled={loading || !content.trim()}
                className={`comment-submit-btn ${content.trim() ? 'active' : 'disabled'}`}
              >
                {loading ? 'Reply' : 'Reply'}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

export default CommentModal;