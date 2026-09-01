import { createSlice } from '@reduxjs/toolkit';

const getStoredSession = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = localStorage.getItem('noir_auth_session');
    if (!raw) return null;

    const session = JSON.parse(raw);
    const expiryTime = typeof session.expiresAt === 'number'
      ? session.expiresAt
      : Date.parse(session.expiresAt);

    if (!session.token || !expiryTime || expiryTime <= Date.now()) {
      localStorage.removeItem('noir_auth_session');
      return null;
    }

    return session;
  } catch {
    localStorage.removeItem('noir_auth_session');
    return null;
  }
};

const storedSession = getStoredSession();

const initialState = {
  isAuthenticated: Boolean(storedSession?.token),
  user: storedSession?.user ?? null,
  token: storedSession?.token ?? null,
  expiresAt: storedSession?.expiresAt ?? null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user || action.payload;
      state.token = action.payload.token || null;
      state.expiresAt = action.payload.expiresAt || null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.expiresAt = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
