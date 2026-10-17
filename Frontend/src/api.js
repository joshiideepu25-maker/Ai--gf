import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

// Increase the timeout from 15000 (15s) to 60000 (60s)
const client = axios.create({ 
  baseURL: BASE, 
  timeout: 60000, 
  headers: { 'Content-Type': 'application/json' } 
});

client.interceptors.request.use((cfg) => {
  try {
    const t = localStorage.getItem('authToken');
    if (t) cfg.headers.Authorization = `Bearer ${t}`;
  } catch (e) {}
  return cfg;
});

client.interceptors.response.use((r) => r, (err) => {
  const e = { 
    message: err?.response?.data?.message || err.message || 'Network error', 
    status: err?.response?.status || null, 
    original: err 
  };
  return Promise.reject(e);
});

export const api = {
  get: async (p, opts) => (await client.get(p, opts)).data,
  post: async (p, b, opts) => (await client.post(p, b, opts)).data,
  put: async (p, b, opts) => (await client.put(p, b, opts)).data,
  del: async (p, opts) => (await client.delete(p, opts)).data,
};
