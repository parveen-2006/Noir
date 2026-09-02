import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Pagination,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Plus } from 'lucide-react';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'Manager',
  status: 'Active',
};

function UserPage({ users = [], roles = [], pagination, onPageChange, onCreateUser, onUpdateUser, can }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || (!editingUser && !form.password)) return;

    const userDetails = {
      name: form.name,
      email: form.email,
      role: form.role,
      status: form.status,
    };

    if (form.password) userDetails.password = form.password;

    const success = editingUser
      ? await onUpdateUser(editingUser.id, userDetails)
      : await onCreateUser(userDetails);

    if (success) {
      setForm(emptyForm);
      setEditingUser(null);
      setIsOpen(false);
    }
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    setForm({ ...emptyForm, role: roles[0]?.name || '' });
    setIsOpen(true);
  };

  const openEditDialog = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role || 'Manager',
      status: user.status === 'Inactive' ? 'Inactive' : 'Active',
    });
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setEditingUser(null);
    setForm(emptyForm);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <Typography variant="overline" sx={{ color: '#a78bfa', letterSpacing: 2, display: 'block', mb: 1 }}>
            People
          </Typography>
          <Typography variant="h3" sx={{ color: '#0f172a', fontWeight: 700 }}>
            User
          </Typography>
        </div>
        {can('users.create') && <IconButton
          onClick={openCreateDialog}
          aria-label="Add user"
          title="Add user"
          sx={{
            backgroundColor: '#2563eb',
            color: '#fff',
            '&:hover': { backgroundColor: '#1d4ed8' },
          }}
        >
          <Plus size={22} strokeWidth={2.5} />
        </IconButton>}
      </header>

      <Card sx={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#0f172a', mb: 2, fontWeight: 600 }}>
            Users
          </Typography>

          {users.length === 0 ? (
            <Typography sx={{ color: '#475569', py: 2 }}>No users created yet.</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Role</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => {
                    const statusColor =
                      user.status === 'Active'
                        ? '#34d399'
                        : user.status === 'Pending'
                          ? '#fbbf24'
                          : '#cbd5e1';

                    return (
                      <TableRow key={`${user.email}-${user.name}`} sx={{ '& td': { borderColor: 'rgba(148,163,184,0.15)' } }}>
                        <TableCell sx={{ color: '#334155' }}>{user.name}</TableCell>
                        <TableCell sx={{ color: '#334155' }}>{user.email}</TableCell>
                        <TableCell sx={{ color: '#334155' }}>{user.role}</TableCell>
                        <TableCell>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              borderRadius: 999,
                              padding: '6px 10px',
                              fontSize: '12px',
                              fontWeight: 700,
                              color: statusColor,
                              background: statusColor + '22',
                            }}
                          >
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>{can('users.update') && <Button size="small" onClick={() => openEditDialog(user)} sx={{ color: '#6d28d9', fontWeight: 700, textTransform: 'none' }}>Edit</Button>}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {pagination?.totalPages > 1 && (
            <Stack alignItems="center" sx={{ pt: 3 }}>
              <Pagination
                page={pagination.page}
                count={pagination.totalPages}
                onChange={(_, page) => onPageChange(page)}
                color="primary"
                shape="rounded"
              />
            </Stack>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#0f172a', background: '#fff' }}>{editingUser ? 'Edit user' : 'Create user'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ background: '#fff', pt: 2 }}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                autoComplete="name"
                inputProps={{ autoComplete: 'name' }}
                InputLabelProps={{ sx: { color: '#475569' } }}
                InputProps={{ sx: { color: '#0f172a', background: '#fff', borderRadius: 2 } }}
              />
              <TextField
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                autoComplete="email"
                inputProps={{ autoComplete: 'email' }}
                InputLabelProps={{ sx: { color: '#475569' } }}
                InputProps={{ sx: { color: '#0f172a', background: '#fff', borderRadius: 2 } }}
              />
              <TextField
                label={editingUser ? 'New password (optional)' : 'Password'}
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                autoComplete="new-password"
                inputProps={{ autoComplete: 'new-password' }}
                InputLabelProps={{ sx: { color: '#475569' } }}
                InputProps={{ sx: { color: '#0f172a', background: '#fff', borderRadius: 2 } }}
              />

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#475569' }}>Role</InputLabel>
                <Select
                  name="role"
                  value={form.role}
                  label="Role"
                  onChange={handleChange}
                  sx={{ color: '#0f172a', background: '#fff', borderRadius: 2 }}
                >
                  {roles.map((role) => <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#475569' }}>Status</InputLabel>
                <Select
                  name="status"
                  value={form.status}
                  label="Status"
                  onChange={handleChange}
                  sx={{ color: '#0f172a', background: '#fff', borderRadius: 2 }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ background: '#fff', px: 3, pb: 2 }}>
            <Button onClick={closeDialog} sx={{ color: '#475569' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              {editingUser ? 'Save changes' : 'Save user'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default UserPage;
