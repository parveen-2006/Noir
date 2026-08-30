import { sanitizeUser, sanitizeUsers, userStore } from '../data/store.js';

export const getUsers = (req, res) => {
  return res.status(200).json({ users: sanitizeUsers(userStore) });
};

export const createUser = (req, res) => {
  const { name, email, password, role, status } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const existingUser = userStore.find(
    (user) => user.email.toLowerCase() === String(email).toLowerCase(),
  );

  if (existingUser) {
    return res.status(409).json({ message: 'User already exists with this email.' });
  }

  const newUser = {
    id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
    name,
    email,
    password,
    role: role || 'Manager',
    status: status || 'Active',
  };

  userStore.unshift(newUser);

  return res.status(201).json({
    message: 'User created successfully',
    user: sanitizeUser(newUser),
  });
};

export const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, status } = req.body || {};

  const index = userStore.findIndex((user) => user.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'User not found.' });
  }

  userStore[index] = {
    ...userStore[index],
    name: name || userStore[index].name,
    email: email || userStore[index].email,
    password: password || userStore[index].password,
    role: role || userStore[index].role,
    status: status || userStore[index].status,
  };

  return res.status(200).json({
    message: 'User updated successfully',
    user: sanitizeUser(userStore[index]),
  });
};

export const deleteUser = (req, res) => {
  const { id } = req.params;
  const index = userStore.findIndex((user) => user.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const [removedUser] = userStore.splice(index, 1);

  return res.status(200).json({
    message: 'User deleted successfully',
    user: sanitizeUser(removedUser),
  });
};
