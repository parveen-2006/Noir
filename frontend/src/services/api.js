import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const AUTH_STORAGE_KEY = 'noir_auth_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

const toTimestamp = (value) => {
  if (typeof value === 'number') return value;

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
};

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
    const expiresAt = toTimestamp(session.expiresAt);

    if (!session.token || !expiresAt || expiresAt <= Date.now()) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      applyAuthToken(null);
      return null;
    }

    applyAuthToken(session.token);
    return session;
  } catch {
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
    // Use the expiry issued by the API. It is an ISO string today, while
    // restored sessions use a numeric timestamp, so normalize it before
    // persisting and comparing it.
    const expiresAt = toTimestamp(response.expiresAt) || Date.now() + SESSION_TTL_MS;
    const session = {
      token: response.token,
      expiresAt,
      user: response.user,
    };

    saveStoredSession(session);
    return {
      ...response,
      expiresAt,
    };
  },
  getUsers: () => apiClient.get('/users'),
  createUser: (payload) => apiClient.post('/users', payload),
  updateUser: (id, payload) => apiClient.put(`/users/${id}`, payload),
  getRoles: () => apiClient.get('/roles'),
  createRole: (payload) => apiClient.post('/roles', payload),
  updateRole: (id, payload) => apiClient.put(`/roles/${id}`, payload),
  deleteRole: (id) => apiClient.delete(`/roles/${id}`),
  getStoredSession: readStoredSession,
  saveSession: saveStoredSession,
  clearSession: clearStoredSession,
};

export const apiService = api;
