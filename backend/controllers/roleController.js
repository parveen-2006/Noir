import { roleStore } from '../data/store.js';

export const getRoles = (req, res) => {
  return res.status(200).json({ roles: roleStore });
};

export const createRole = (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const existingRole = roleStore.find(
    (role) => role.email.toLowerCase() === String(email).toLowerCase(),
  );

  if (existingRole) {
    return res.status(409).json({ message: 'Role with this email already exists.' });
  }

  const newRole = {
    id: crypto.randomUUID ? crypto.randomUUID() : `role-${Date.now()}`,
    name,
    email,
    password,
    description: 'Custom role created from admin panel.',
    users: 0,
  };

  roleStore.unshift(newRole);

  return res.status(201).json({
    message: 'Role created successfully',
    role: newRole,
  });
};

export const updateRole = (req, res) => {
  const { id } = req.params;
  const { name, description, email, password } = req.body || {};

  const index = roleStore.findIndex((role) => role.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Role not found.' });
  }

  roleStore[index] = {
    ...roleStore[index],
    name: name || roleStore[index].name,
    description: description || roleStore[index].description,
    email: email || roleStore[index].email,
    password: password || roleStore[index].password,
  };

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

  const [removedRole] = roleStore.splice(index, 1);

  return res.status(200).json({
    message: 'Role deleted successfully',
    role: removedRole,
  });
};
