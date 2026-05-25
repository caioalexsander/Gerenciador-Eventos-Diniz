import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://192.168.1.240:3001',  // ← Troque pelo seu IP real
  baseURL: 'https://backend-gerenciador-eventos-diniz-production.up.railway.app:3001',
  timeout: 10000,
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});

export default api;