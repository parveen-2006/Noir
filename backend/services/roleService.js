import Role from '../models/Role.js';
import User from '../models/User.js';

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const listRoles = async () => {
  const roles = await Role.find().sort({ createdAt: -1 }).lean();
  const userCounts = await User.aggregate([{ $group: { _id: '$role', users: { $sum: 1 } } }]);
  const countsByRole = new Map(userCounts.map((item) => [item._id, item.users]));
  return { roles: roles.map((role) => ({ ...role, id: String(role._id), users: countsByRole.get(role.name) || 0 })) };
};

export const createRole = async ({ name, description, permissions } = {}) => {
  if (!name) throw createError('Role name is required.', 400);

  const existingRole = await Role.findOne({ name: String(name).trim() });

  if (existingRole) {
    throw createError('A role with this name already exists.', 409);
  }

  const newRole = await Role.create({
    name,
    description: description || 'Custom role.',
    permissions: Array.isArray(permissions) ? permissions : [],
  });

  return { message: 'Role created successfully', role: { ...newRole.toObject(), id: newRole.id, users: 0 } };
};

export const updateRole = async (id, { name, description, permissions } = {}) => {
  const role = await Role.findById(id);
  if (!role) throw createError('Role not found.', 404);

  const duplicateName = name && await Role.exists({ name: String(name).trim(), _id: { $ne: id } });

  if (duplicateName) {
    throw createError('A role with this name already exists.', 409);
  }

  const previousName = role.name;
  role.name = name || role.name;
  role.description = description || role.description;
  role.permissions = Array.isArray(permissions) ? permissions : role.permissions;
  await role.save();

  if (name && name !== previousName) {
    await User.updateMany({ role: previousName }, { $set: { role: role.name } });
  }

  const users = await User.countDocuments({ role: role.name });
  return { message: 'Role updated successfully', role: { ...role.toObject(), id: role.id, users } };
};

export const deleteRole = async (id) => {
  const role = await Role.findById(id);
  if (!role) throw createError('Role not found.', 404);

  if (await User.exists({ role: role.name })) {
    throw createError('This role is assigned to users and cannot be deleted.', 409);
  }

  await role.deleteOne();

  return { message: 'Role deleted successfully', role: { ...role.toObject(), id: role.id, users: 0 } };
};