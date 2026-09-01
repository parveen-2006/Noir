import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const AUTH_STORAGE_KEY = 'noir_auth_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const applyAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
};

const readStoredSession = () => {
  try {
    const sessionRaw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!sessionRaw) return null;

    const session = JSON.parse(sessionRaw);
    const expiresAt = Number(session.expiresAt || 0);

    if (!session.token || !expiresAt || expiresAt <= Date.now()) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      applyAuthToken(null);
      return null;
    }

    applyAuthToken(session.token);
    return session;
  } catch (error) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    applyAuthToken(null);
    return null;
  }
};

const saveStoredSession = (session) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  applyAuthToken(session.token);
};

const clearStoredSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  applyAuthToken(null);
};

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error?.response?.data?.message || error?.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export const api = {
  login: async (payload) => {
    const response = await apiClient.post('/auth/login', payload);
    const expiresAt = Date.now() + SESSION_TTL_MS;
    const session = {
      token: response.token,
      expiresAt,
      user: response.user,
    };

    saveStoredSession(session);
    return response;
  },
  getUsers: () => apiClient.get('/users'),
  createUser: (payload) => apiClient.post('/users', payload),
  getRoles: () => apiClient.get('/roles'),
  createRole: (payload) => apiClient.post('/roles', payload),
  getStoredSession: readStoredSession,
  saveSession: saveStoredSession,
  clearSession: clearStoredSession,
};

export const apiService = api;
