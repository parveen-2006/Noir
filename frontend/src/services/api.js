import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error?.response?.data?.message || error?.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export const api = {
  login: (payload) => apiClient.post('/auth/login', payload),
  getUsers: () => apiClient.get('/users'),
  createUser: (payload) => apiClient.post('/users', payload),
  getRoles: () => apiClient.get('/roles'),
  createRole: (payload) => apiClient.post('/roles', payload),
};

export const apiService = api;
