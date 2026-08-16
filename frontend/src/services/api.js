import axios from 'axios';

const api = axios.create({
  baseURL: 'https://projetofinalclonedox.onrender.com/api/',
});

export default api;