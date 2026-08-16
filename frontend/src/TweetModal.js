import React, { useState } from 'react';
import './TweetModal.css';
import api from './services/api';

function TweetModal({ onClose, onPostCreated }) {
  const [content, setContent] = useState('');

  const handlePost = async () => {
    if (content.trim() === '') return;

    try {
      const token = localStorage.getItem('access');
      // esse codigo esta Usando o 'api' configurado com a URL do Render
      const response = await api.post('posts/', {
        content: content
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Post criado com sucesso:', response.data);

      setContent('');
      onPostCreated();
      onClose();

    } catch (error) {
      console.error("Erro ao criar post:", error.response ? error.response.data : error.message);
      alert('Erro ao criar post. Verifique se você está logado.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button onClick={onClose}>X</button>
        </div>

        <div className="tweet-compose">
          <div className="avatar-placeholder">👤</div>
          <textarea 
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)} 
          ></textarea>
        </div>

        <div className="tweet-footer">
          <div className="visibility-option">🌐 Everyone can reply</div>
          <div className="actions">
          </div>
          <button className="post-button" onClick={handlePost}>Post</button>
        </div>
      </div>
    </div>
  );
}

export default TweetModal;