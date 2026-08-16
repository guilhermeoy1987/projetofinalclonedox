import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FollowPage.css';
import api from './services/api';

function FollowPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await api.get('users/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  const handleToggleFollow = async (userId) => {
    // 1. Faz a alteração do estado visual no exato momento do clique
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, is_following: !user.is_following }
          : user
      )
    );

    try {
      const token = localStorage.getItem('access');
      const response = await api.post(
        `users/${userId}/follow/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Confirmação do estado retornado pela API
      if (response.data && response.data.is_following !== undefined) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, is_following: response.data.is_following }
              : user
          )
        );
      }
    } catch (error) {
      console.error("Erro ao seguir usuário:", error);
      // Reverte para o estado anterior caso ocorra erro
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, is_following: !user.is_following }
            : user
        )
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //ess e codigo  Filtrar o usuário logado para não aparecer na lista
  const currentUsername = localStorage.getItem('username');
  const filteredUsers = users.filter((user) => user.username !== currentUsername);

  return (
    <div className="follow-container">
      <h1>Usuários para seguir</h1>
      <button className="back-home-btn" onClick={() => navigate('/home')}>
        Voltar para Home
      </button>
      
      <ul className="follow-list">
        {filteredUsers.length === 0 ? (
          <p>Nenhum outro usuário cadastrado encontrado.</p>
        ) : (
          filteredUsers.map((user) => (
            <li key={user.id} className="follow-item">
              <span className="follow-username">{user.username}</span>
              
              <div className="follow-actions">
                <button 
                  className="btn-view-profile"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  Ver Perfil
                </button>
                
                <button 
                  className={`btn-follow-toggle ${user.is_following ? 'is-following' : 'not-following'}`}
                  onClick={() => handleToggleFollow(user.id)}
                >
                  {user.is_following ? 'Seguindo' : 'Seguir'}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default FollowPage;