import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://dashmottu-api.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});