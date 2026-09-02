import { roleStore, userStore } from '../data/store.js';

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const listRoles = () => ({ roles: roleStore });

export const createRole = ({ name, description, permissions } = {}) => {
  if (!name) throw createError('Role name is required.', 400);

  const existingRole = roleStore.find(
    (role) => role.name.toLowerCase() === String(name).toLowerCase(),
  );

  if (existingRole) {
    throw createError('A role with this name already exists.', 409);
  }

  const newRole = {
    id: crypto.randomUUID ? crypto.randomUUID() : `role-${Date.now()}`,
    name,
    description: description || 'Custom role.',
    users: 0,
    permissions: Array.isArray(permissions) ? permissions : [],
  };

  roleStore.unshift(newRole);

  return { message: 'Role created successfully', role: newRole };
};

export const updateRole = (id, { name, description, permissions } = {}) => {
  const index = roleStore.findIndex((role) => role.id === id);
  if (index === -1) throw createError('Role not found.', 404);

  const duplicateName = name && roleStore.some(
    (role) => role.id !== id && role.name.toLowerCase() === String(name).toLowerCase(),
  );

  if (duplicateName) {
    throw createError('A role with this name already exists.', 409);
  }

  const previousName = roleStore[index].name;
  roleStore[index] = {
    ...roleStore[index],
    name: name || roleStore[index].name,
    description: description || roleStore[index].description,
    permissions: Array.isArray(permissions) ? permissions : roleStore[index].permissions,
  };

  if (name && name !== previousName) {
    userStore.forEach((user) => {
      if (user.role === previousName) user.role = name;
    });
  }

  return { message: 'Role updated successfully', role: roleStore[index] };
};

export const deleteRole = (id) => {
  const index = roleStore.findIndex((role) => role.id === id);
  if (index === -1) throw createError('Role not found.', 404);

  if (userStore.some((user) => user.role === roleStore[index].name)) {
    throw createError('This role is assigned to users and cannot be deleted.', 409);
  }

  const [removedRole] = roleStore.splice(index, 1);

  return { message: 'Role deleted successfully', role: removedRole };
};