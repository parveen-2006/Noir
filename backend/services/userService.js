import { roleStore, sanitizeUser, sanitizeUsers, userStore } from '../data/store.js';

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const listUsers = ({ page: requestedPage, limit: requestedLimit } = {}) => {
  const parsedPage = Number.parseInt(requestedPage, 10);
  const parsedLimit = Number.parseInt(requestedLimit, 10);
  const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 10;
  const total = userStore.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const page = Number.isFinite(parsedPage) ? Math.min(Math.max(parsedPage, 1), totalPages) : 1;
  const startIndex = (page - 1) * limit;

  return {
    users: sanitizeUsers(userStore.slice(startIndex, startIndex + limit)),
    pagination: { page, limit, total, totalPages },
  };
};

export const createUser = ({ name, email, password, role, status } = {}) => {
  if (!name || !email || !password) {
    throw createError('Name, email, and password are required.', 400);
  }

  const existingUser = userStore.find(
    (user) => user.email.toLowerCase() === String(email).toLowerCase(),
  );

  if (existingUser) {
    throw createError('User already exists with this email.', 409);
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

  return {
    message: 'User created successfully',
    user: sanitizeUser(newUser),
  };
};

export const updateUser = (id, { name, email, password, role, status } = {}) => {
  const index = userStore.findIndex((user) => user.id === id);
  if (index === -1) throw createError('User not found.', 404);

  if (role && !roleStore.some((item) => item.name === role)) {
    throw createError('Select a valid role.', 400);
  }

  const duplicateEmail = userStore.some(
    (user) => user.id !== id && user.email.toLowerCase() === String(email || '').toLowerCase(),
  );

  if (email && duplicateEmail) {
    throw createError('Another user already exists with this email.', 409);
  }

  userStore[index] = {
    ...userStore[index],
    name: name || userStore[index].name,
    email: email || userStore[index].email,
    password: password || userStore[index].password,
    role: role || userStore[index].role,
    status: status || userStore[index].status,
  };

  return {
    message: 'User updated successfully',
    user: sanitizeUser(userStore[index]),
  };
};

export const deleteUser = (id) => {
  const index = userStore.findIndex((user) => user.id === id);
  if (index === -1) throw createError('User not found.', 404);

  const [removedUser] = userStore.splice(index, 1);

  return {
    message: 'User deleted successfully',
    user: sanitizeUser(removedUser),
  };
};