import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username: username,
        password: password
      });

      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('userId', response.data.user_id);

      alert('Login realizado com sucesso!');
      navigate('/home'); 
      
    } catch (error) {
      console.error("Erro na autenticação:", error.response ? error.response.data : error.message);
      alert('Erro ao fazer login. Verifique seu usuário e senha.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Entrar no Clone Twitter</h1>
        <p>Digite suas credenciais para acessar sua conta</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          <button type="submit">Entrar</button>
        </form>

        <p className="register-link">
          Não tem uma conta? <a href="/register">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}

export default Login;