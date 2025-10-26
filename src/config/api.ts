import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
  baseURL: process.env.BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  async config => {
    const token = process.env.API_TOKEN;
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para logar as requisições
api.interceptors.request.use(request => {
  console.log('Request:', {
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers
  });
  return request;
}, error => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Interceptor para logar as respostas
api.interceptors.response.use(response => {
  console.log('Response:', {
    status: response.status,
    data: response.data,
    headers: response.headers
  });
  return response;
}, error => {
  console.error('Response Error:', error.response || error);
  return Promise.reject(error);
});