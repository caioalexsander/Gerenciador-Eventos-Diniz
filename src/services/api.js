import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.240:3001',  // ← Troque pelo seu IP real
  timeout: 10000,
});

export default api;