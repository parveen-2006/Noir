import { sanitizeUser, userStore } from '../data/store.js';

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

  return res.status(200).json({
    message: 'Login successful',
    user: sanitizeUser(user),
  });
};
