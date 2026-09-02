import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'Manager',
  status: 'Active',
};

function UserPage({ users = [], roles = [], pagination, onPageChange, onCreateUser, onUpdateUser, onDeleteUser, can }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
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

  const confirmDelete = async () => {
    if (!deletingUser) return;

    const success = await onDeleteUser(deletingUser.id);
    if (success) setDeletingUser(null);
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

      <div>
        {users.length === 0 ? (
          <Typography sx={{ color: '#475569', py: 2 }}>No users created yet.</Typography>
        ) : (
          <DataTable
            columns={[
                {
                  key: 'serial',
                  label: 'S. No.',
                  render: (user, index) => ((pagination?.page || 1) - 1) * (pagination?.limit || users.length) + index + 1,
                },
                { key: 'name', label: 'Name', cellSx: { color: '#334155' }, render: (user) => user.name },
                { key: 'email', label: 'Email', cellSx: { color: '#334155' }, render: (user) => user.email },
                { key: 'role', label: 'Role', cellSx: { color: '#334155' }, render: (user) => user.role },
                {
                  key: 'status',
                  label: 'Status',
                  render: (user) => {
                    const statusColor =
                      user.status === 'Active'
                        ? '#34d399'
                        : user.status === 'Pending'
                          ? '#fbbf24'
                          : '#cbd5e1';

                    return (
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
                    );
                  },
                },
                {
                  key: 'action',
                  label: 'Action',
                  render: (user) => (
                    <Stack direction="row" spacing={0.5}>
                      {can('users.update') && <Tooltip title="Edit user"><IconButton aria-label={`Edit ${user.name}`} size="small" onClick={() => openEditDialog(user)} sx={{ color: '#6d28d9' }}><Pencil size={18} /></IconButton></Tooltip>}
                      {can('users.delete') && <Tooltip title="Delete user"><IconButton aria-label={`Delete ${user.name}`} size="small" onClick={() => setDeletingUser(user)} sx={{ color: '#dc2626' }}><Trash2 size={18} /></IconButton></Tooltip>}
                    </Stack>
                  ),
                },
              ]}
              rows={users}
              emptyState="No users created yet."
              getRowKey={(user) => `${user.email}-${user.name}`}
              containerSx={{ background: 'transparent', boxShadow: 'none', border: 'none' }}
              rowSx={{ '& td': { borderColor: 'rgba(148,163,184,0.15)' } }}
            />
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
      </div>

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

      <Dialog open={Boolean(deletingUser)} onClose={() => setDeletingUser(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: '#0f172a' }}>Delete user?</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete {deletingUser?.name}? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeletingUser(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete} sx={{ textTransform: 'none' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserPage;
