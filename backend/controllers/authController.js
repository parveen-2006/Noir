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

export const loginUser = (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = userStore.find(
    (item) =>
      item.email.toLowerCase() === String(email).toLowerCase() &&
      item.password === String(password),
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = createSessionToken(user);

  return res.status(200).json({
    message: 'Login successful',
    token,
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
    user: sanitizeUser(user),
  });
};
