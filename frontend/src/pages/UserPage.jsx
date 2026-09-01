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
  InputLabel,
  MenuItem,
  Paper,
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

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'Manager',
  status: 'Active',
};

function UserPage({ users = [], onCreateUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.password) return;

    const newUser = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      status: form.status,
    };

    const success = await onCreateUser(newUser);
    if (success) {
      setForm(emptyForm);
      setIsOpen(false);
    }
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
        <Button
          variant="contained"
          onClick={() => setIsOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            borderRadius: 2,
            textTransform: 'none',
            px: 2.5,
            py: 1.25,
            fontWeight: 600,
          }}
        >
          Add user
        </Button>
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
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#0f172a', background: '#fff' }}>Create user</DialogTitle>
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
                label="Password"
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
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Support">Support</MenuItem>
                  <MenuItem value="Editor">Editor</MenuItem>
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
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ background: '#fff', px: 3, pb: 2 }}>
            <Button onClick={() => setIsOpen(false)} sx={{ color: '#475569' }}>
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
              Save user
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default UserPage;
