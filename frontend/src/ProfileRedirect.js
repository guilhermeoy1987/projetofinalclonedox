import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      //ese codigo é chave codigo que Redireciona dinamicamente para a rota com o ID do usuário logado
      navigate(`/profile/${userId}`, { replace: true });
    } else {
      //ese codigo é muito imporante e caso  Se não encontrar o ID, joga para o login
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return <p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando perfil...</p>;
}

export default ProfileRedirect;