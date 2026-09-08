import bcrypt from 'bcryptjs';
import Role from '../models/Role.js';
import User from '../models/User.js';

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const toUserResponse = (user, permissions = []) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  permissions,
});

const toUserResponses = async (users) => {
  const roles = await Role.find({ name: { $in: users.map((user) => user.role) } }).lean();
  const permissionsByRole = new Map(roles.map((role) => [role.name, role.permissions]));
  return users.map((user) => toUserResponse(user, permissionsByRole.get(user.role) || []));
};

export const listUsers = async ({ page: requestedPage, limit: requestedLimit } = {}) => {
  const parsedPage = Number.parseInt(requestedPage, 10);
  const parsedLimit = Number.parseInt(requestedLimit, 10);
  const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 10;
  const total = await User.countDocuments();
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const page = Number.isFinite(parsedPage) ? Math.min(Math.max(parsedPage, 1), totalPages) : 1;
  const startIndex = (page - 1) * limit;

  return {
    users: await toUserResponses(await User.find().sort({ createdAt: -1 }).skip(startIndex).limit(limit).lean()),
    pagination: { page, limit, total, totalPages },
  };
};

export const createUser = async ({ name, email, password, role, status } = {}) => {
  if (!name || !email || !password) {
    throw createError('Name, email, and password are required.', 400);
  }

  const normalizedEmail = String(email).toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw createError('User already exists with this email.', 409);
  }

  if (role && !(await Role.exists({ name: role }))) {
    throw createError('Select a valid role.', 400);
  }

  const newUser = await User.create({
    name,
    email: normalizedEmail,
    password: await bcrypt.hash(password, 12),
    role: role || 'Manager',
    status: status || 'Active',
  });
  const assignedRole = await Role.findOne({ name: newUser.role });

  return {
    message: 'User created successfully',
    user: toUserResponse(newUser, assignedRole?.permissions || []),
  };
};

export const updateUser = async (id, { name, email, password, role, status } = {}) => {
  const user = await User.findById(id).select('+password');
  if (!user) throw createError('User not found.', 404);

  if (role && !(await Role.exists({ name: role }))) {
    throw createError('Select a valid role.', 400);
  }

  const normalizedEmail = email ? String(email).toLowerCase() : user.email;
  const duplicateEmail = email && await User.exists({ email: normalizedEmail, _id: { $ne: id } });

  if (email && duplicateEmail) {
    throw createError('Another user already exists with this email.', 409);
  }

  user.name = name || user.name;
  user.email = normalizedEmail;
  user.password = password ? await bcrypt.hash(password, 12) : user.password;
  user.role = role || user.role;
  user.status = status || user.status;
  await user.save();
  const assignedRole = await Role.findOne({ name: user.role });

  return {
    message: 'User updated successfully',
    user: toUserResponse(user, assignedRole?.permissions || []),
  };
};

export const deleteUser = async (id) => {
  const removedUser = await User.findByIdAndDelete(id);
  if (!removedUser) throw createError('User not found.', 404);
  const role = await Role.findOne({ name: removedUser.role });

  return {
    message: 'User deleted successfully',
    user: toUserResponse(removedUser, role?.permissions || []),
  };
};