import axios from 'axios';
import { getCookie } from '@/utils/cookies';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  let token: string | null = null;

  if (typeof window !== 'undefined') {
    token = getCookie('token');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
