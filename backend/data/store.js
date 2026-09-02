export const userStore = [
  {
    id: 'seed-admin-1',
    name: 'System Admin',
    email: 'admin@noir.com',
    password: 'admin123',
    role: 'Administrator',
    status: 'Active',
  },
];

export const roleStore = [
  {
    id: 'seed-role-1',
    name: 'Administrator',
    email: 'admin@noir.com',
    password: 'admin123',
    description: 'Full access and system configuration.',
    users: 1,
    permissions: [
      'dashboard.view', 'users.view', 'users.create', 'users.update', 'users.delete',
      'roles.view', 'roles.create', 'roles.update', 'roles.delete',
    ],
  },
];

export const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  permissions: roleStore.find((role) => role.name === user.role)?.permissions || [],
});

export const sanitizeUsers = (users) => users.map(sanitizeUser);
