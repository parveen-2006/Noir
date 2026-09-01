import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const emptyForm = {
  name: '',
  email: '',
  password: '',
};

function RolePage({ roles = [], onCreateRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.password) return;

    const success = await onCreateRole({
      name: form.name,
      email: form.email,
      password: form.password,
      description: 'Custom role created from admin panel.',
    });

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
            Access control
          </Typography>
          <Typography variant="h3" sx={{ color: '#0f172a', fontWeight: 700 }}>
            Role
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
          Create role
        </Button>
      </header>

      <Grid container spacing={2}>
        {roles.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <CardContent>
                <Typography sx={{ color: '#475569' }}>No roles created yet.</Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          roles.map((role) => (
            <Grid item xs={12} md={6} xl={4} key={`${role.name}-${role.email || 'role'}`}>
              <Card
                sx={{
                  background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Typography
                    variant="button"
                    sx={{
                      display: 'inline-block',
                      background: 'rgba(139,92,246,0.12)',
                      color: '#d8b4fe',
                      borderRadius: 999,
                      px: 1.5,
                      py: 0.75,
                      mb: 2,
                    }}
                  >
                    {role.name}
                  </Typography>
                  <Typography sx={{ color: '#475569', mb: 2 }}>{role.description}</Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ color: '#93c5fd' }}>{role.users ?? 0} users</Typography>
                    <Button size="small" sx={{ color: '#6d28d9' }}>
                      Manage
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#0f172a', background: '#fff' }}>Create role</DialogTitle>
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
              Save role
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default RolePage;
