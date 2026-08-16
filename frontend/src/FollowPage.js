import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FollowPage.css';

function FollowPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get('http://127.0.0.1:8000/api/users/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  const handleToggleFollow = async (userId) => {
    // 1. esse codigo faz a alteracap  do estado visual no exato momento do clique
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, is_following: !user.is_following }
          : user
      )
    );

    try {
      const token = localStorage.getItem('access');
      const response = await axios.post(
        `http://127.0.0.1:8000/api/users/${userId}/follow/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      //esse  que faz o mapa e os codigo que fazer a confirmação do estado retornado pela API
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
      // 3.caso bnao encontrar e caso se der erro no servidor, reverte para o estado anterior
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

  // codigo para Filtrar o usuário logado para não aparecer na lista de ouro usuario
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