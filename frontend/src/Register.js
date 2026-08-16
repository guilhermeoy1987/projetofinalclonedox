import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // usar o mesmo CSS do Login
import api from './services/api';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      // par a a Envia os dados para a API de registro do Django que criamos
      await api.post('register/', {
        username: username,
        email: email,
        password: password
      });

      alert('Conta criada com sucesso! Faça o login.');
      navigate('/login'); //aqui  Redireciona para a tela de login
      
   } catch (error) {
      console.error("Erro no cadastro:", error.response ? error.response.data : error.message);
      
      // Mude esta linha do alert para mostrar a resposta do servidor:
      const mensagemErro = error.response && error.response.data 
        ? JSON.stringify(error.response.data) 
        : 'Erro ao criar conta.';
      
      alert(mensagemErro);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Criar Conta</h1>
        <p>Preencha os dados abaixo para se cadastrar</p>
        <form onSubmit={handleRegister}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
          <input 
            type="email" 
            placeholder="seu@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Confirmar Senha" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required
          />
          <button type="submit">Criar Conta</button>
        </form>
        <p className="register-link">
          Já tem uma conta? <a href="/login">Entrar</a>
        </p>
      </div>
    </div>
  );
}

export default Register;