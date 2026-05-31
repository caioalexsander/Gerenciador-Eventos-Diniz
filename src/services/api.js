import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://192.168.1.240:3001',  // ← Troque pelo seu IP real
  baseURL: 'https://backend-gerenciador-eventos-diniz-production.up.railway.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;