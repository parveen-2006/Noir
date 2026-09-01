import { useState } from 'react';
import { Button, Card, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Stack, TextField, Typography } from '@mui/material';

const permissionModules = [
  { name: 'Dashboard', permissions: [['dashboard.view', 'View dashboard']] },
  { name: 'User', permissions: [['users.view', 'View users'], ['users.create', 'Create users'], ['users.update', 'Edit users']] },
  { name: 'Role', permissions: [['roles.view', 'View roles'], ['roles.create', 'Create roles'], ['roles.update', 'Edit roles'], ['roles.delete', 'Delete roles']] },
];
const emptyForm = { name: '', description: '', permissions: [] };

function RolePage({ roles = [], onCreateRole, onUpdateRole, onDeleteRole, can }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const openCreate = () => { setEditingRole(null); setForm(emptyForm); setIsOpen(true); };
  const openEdit = (role) => { setEditingRole(role); setForm({ name: role.name, description: role.description || '', permissions: role.permissions || [] }); setIsOpen(true); };
  const close = () => { setIsOpen(false); setEditingRole(null); setForm(emptyForm); };
  const togglePermission = (permission) => setForm((current) => ({ ...current, permissions: current.permissions.includes(permission) ? current.permissions.filter((item) => item !== permission) : [...current.permissions, permission] }));
  const submit = async (event) => { event.preventDefault(); if (!form.name) return; const success = editingRole ? await onUpdateRole(editingRole.id, form) : await onCreateRole(form); if (success) close(); };
  const remove = async (role) => { if (window.confirm(`Delete the ${role.name} role?`)) await onDeleteRole(role.id); };

  return <div className="mx-auto max-w-6xl">
    <header className="mb-6 flex items-center justify-between gap-4">
      <div><Typography variant="overline" sx={{ color: '#8b5cf6', letterSpacing: 2, display: 'block', mb: 1 }}>Access control</Typography><Typography variant="h3" sx={{ color: '#0f172a', fontWeight: 700 }}>Roles</Typography></div>
      {can('roles.create') && <Button variant="contained" onClick={openCreate} sx={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: 2, textTransform: 'none', px: 2.5, py: 1.25, fontWeight: 600 }}>Create role</Button>}
    </header>
    <Grid container spacing={2}>{roles.map((role) => <Grid item xs={12} md={6} xl={4} key={role.id}>
      <Card sx={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,.06)', height: '100%' }}><CardContent>
        <Typography variant="button" sx={{ display: 'inline-block', background: '#f3e8ff', color: '#7e22ce', borderRadius: 999, px: 1.5, py: .75, mb: 2 }}>{role.name}</Typography>
        <Typography sx={{ color: '#475569', mb: 2 }}>{role.description}</Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>{role.permissions?.length || 0} permissions · {role.users ?? 0} users</Typography>
        <Stack direction="row" spacing={1}>{can('roles.update') && <Button size="small" onClick={() => openEdit(role)} sx={{ color: '#6d28d9', textTransform: 'none' }}>Edit</Button>}{can('roles.delete') && <Button size="small" onClick={() => remove(role)} sx={{ color: '#dc2626', textTransform: 'none' }}>Delete</Button>}</Stack>
      </CardContent></Card>
    </Grid>)}</Grid>
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth><DialogTitle sx={{ color: '#0f172a' }}>{editingRole ? 'Edit role' : 'Create role'}</DialogTitle>
      <form onSubmit={submit}><DialogContent><Stack spacing={2}>
        <TextField label="Role name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required fullWidth />
        <TextField label="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} fullWidth multiline minRows={2} />
        <div><Typography variant="subtitle2" sx={{ color: '#334155', mb: 1 }}>Permissions</Typography>
          <Stack spacing={2}>{permissionModules.map((module) => <div key={module.name} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <Typography variant="subtitle2" sx={{ color: '#0f172a', fontWeight: 700, mb: .5 }}>{module.name}</Typography>
            <div>{module.permissions.map(([value, label]) => <FormControlLabel key={value} control={<Checkbox checked={form.permissions.includes(value)} onChange={() => togglePermission(value)} />} label={label} />)}</div>
          </div>)}</Stack>
        </div>
      </Stack></DialogContent><DialogActions><Button onClick={close}>Cancel</Button><Button type="submit" variant="contained">{editingRole ? 'Save changes' : 'Create role'}</Button></DialogActions></form>
    </Dialog>
  </div>;
}

export default RolePage;
