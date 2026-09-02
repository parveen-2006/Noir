import { sanitizeUser, userStore } from '../data/store.js';

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const createSessionToken = (user) => {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + TOKEN_TTL_MS,
  };

  return Buffer.from(JSON.stringify(payload)).toString('base64url');
};

export const authenticateUser = ({ email, password } = {}) => {
  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const user = userStore.find(
    (item) =>
      item.email.toLowerCase() === String(email).toLowerCase() &&
      item.password === String(password),
  );

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = createSessionToken(user);

  return {
    message: 'Login successful',
    token,
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
    user: sanitizeUser(user),
  };
};