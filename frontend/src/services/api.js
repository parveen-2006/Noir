const API_BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const api = {
  login: (payload) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getUsers: () => request('/users'),
  createUser: (payload) => request('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getRoles: () => request('/roles'),
  createRole: (payload) => request('/roles', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};
