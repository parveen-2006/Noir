import { roleStore, userStore } from '../data/store.js';

export const getRoles = (req, res) => {
  return res.status(200).json({ roles: roleStore });
};

export const createRole = (req, res) => {
  const { name, description, permissions } = req.body || {};

  if (!name) {
    return res.status(400).json({ message: 'Role name is required.' });
  }

  const existingRole = roleStore.find(
    (role) => role.name.toLowerCase() === String(name).toLowerCase(),
  );

  if (existingRole) {
    return res.status(409).json({ message: 'A role with this name already exists.' });
  }

  const newRole = {
    id: crypto.randomUUID ? crypto.randomUUID() : `role-${Date.now()}`,
    name,
    description: description || 'Custom role.',
    users: 0,
    permissions: Array.isArray(permissions) ? permissions : [],
  };

  roleStore.unshift(newRole);

  return res.status(201).json({
    message: 'Role created successfully',
    role: newRole,
  });
};

export const updateRole = (req, res) => {
  const { id } = req.params;
  const { name, description, permissions } = req.body || {};

  const index = roleStore.findIndex((role) => role.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Role not found.' });
  }

  const duplicateName = name && roleStore.some(
    (role) => role.id !== id && role.name.toLowerCase() === String(name).toLowerCase(),
  );

  if (duplicateName) {
    return res.status(409).json({ message: 'A role with this name already exists.' });
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

  return res.status(200).json({
    message: 'Role updated successfully',
    role: roleStore[index],
  });
};

export const deleteRole = (req, res) => {
  const { id } = req.params;
  const index = roleStore.findIndex((role) => role.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Role not found.' });
  }

  if (userStore.some((user) => user.role === roleStore[index].name)) {
    return res.status(409).json({ message: 'This role is assigned to users and cannot be deleted.' });
  }

  const [removedRole] = roleStore.splice(index, 1);

  return res.status(200).json({
    message: 'Role deleted successfully',
    role: removedRole,
  });
};
