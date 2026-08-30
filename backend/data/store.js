export const userStore = [
  {
    id: 'seed-admin-1',
    name: 'System Admin',
    email: 'admin@noir.com',
    password: 'admin123',
    role: 'Admin',
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
  },
];

export const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
});

export const sanitizeUsers = (users) => users.map(sanitizeUser);
