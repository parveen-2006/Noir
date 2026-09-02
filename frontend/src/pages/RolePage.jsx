import { useState } from 'react';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { Pencil, Trash2 } from 'lucide-react';

const permissionModules = [
  { name: 'Dashboard', permissions: [['dashboard.view', 'View dashboard']] },
  { name: 'User', permissions: [['users.view', 'View users'], ['users.create', 'Create users'], ['users.update', 'Edit users'], ['users.delete', 'Delete users']] },
  { name: 'Role', permissions: [['roles.view', 'View roles'], ['roles.create', 'Create roles'], ['roles.update', 'Edit roles'], ['roles.delete', 'Delete roles']] },
];
const emptyForm = { name: '', description: '', permissions: [] };

function RolePage({ roles = [], users = [], onCreateRole, onUpdateRole, onDeleteRole, can }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => { setEditingRole(null); setForm(emptyForm); setIsOpen(true); };
  const openEdit = (role) => { setEditingRole(role); setForm({ name: role.name, description: role.description || '', permissions: role.permissions || [] }); setIsOpen(true); };
  const close = () => { setIsOpen(false); setEditingRole(null); setForm(emptyForm); };
  const togglePermission = (permission) => setForm((current) => ({ ...current, permissions: current.permissions.includes(permission) ? current.permissions.filter((item) => item !== permission) : [...current.permissions, permission] }));
  const submit = async (event) => { event.preventDefault(); if (!form.name) return; const success = editingRole ? await onUpdateRole(editingRole.id, form) : await onCreateRole(form); if (success) close(); };
  const confirmDelete = async () => {
    if (!roleToDelete) return;
    const deleted = await onDeleteRole(roleToDelete.id);
    if (deleted) setRoleToDelete(null);
  };

  return <div className="mx-auto max-w-6xl">
    <header className="mb-6 flex items-center justify-between gap-4">
      <div><Typography variant="overline" sx={{ color: '#8b5cf6', letterSpacing: 2, display: 'block', mb: 1 }}>Access control</Typography><Typography variant="h3" sx={{ color: '#0f172a', fontWeight: 700 }}>Roles</Typography></div>
      {can('roles.create') && <Button variant="contained" onClick={openCreate} sx={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: 2, textTransform: 'none', px: 2.5, py: 1.25, fontWeight: 600 }}>Create role</Button>}
    </header>

    <TableContainer component={Paper} sx={{ border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,.06)', borderRadius: 2 }}>
      <Table aria-label="Roles">
        <TableHead sx={{ backgroundColor: '#f8fafc' }}><TableRow>
          <TableCell sx={{ color: '#475569', fontWeight: 700 }}>S. No.</TableCell>
          <TableCell sx={{ color: '#475569', fontWeight: 700 }}>Role name</TableCell>
          <TableCell sx={{ color: '#475569', fontWeight: 700 }}>Users</TableCell>
          <TableCell sx={{ color: '#475569', fontWeight: 700 }}>Permissions</TableCell>
          <TableCell align="right" sx={{ color: '#475569', fontWeight: 700, width: 140 }}>Action</TableCell>
        </TableRow></TableHead>
        <TableBody>
          {roles.map((role, index) => {
            const assignedUserCount = users.filter((user) => user.role === role.name).length;
            const rolePermissions = Array.isArray(role.permissions) ? role.permissions : [];
            const visiblePermissions = rolePermissions.slice(0, 2).join(', ');
            const additionalPermissionCount = rolePermissions.length - 2;
            const permissionSummary = visiblePermissions
              ? `${visiblePermissions}${additionalPermissionCount > 0 ? ` +${additionalPermissionCount}` : ''}`
              : 'None';

            return <TableRow key={role.id} hover>
              <TableCell>{index + 1}</TableCell>
              <TableCell sx={{ color: '#0f172a', fontWeight: 600 }}>{role.name}</TableCell>
              <TableCell>{assignedUserCount}</TableCell>
              <TableCell sx={{ color: '#2563eb', maxWidth: 420 }}>{permissionSummary}</TableCell>
              <TableCell align="right" sx={{ width: 140 }}><Stack direction="row" spacing={0.5} justifyContent="flex-end">
                {can('roles.update') && <Tooltip title="Edit role"><IconButton aria-label={`Edit ${role.name}`} size="small" onClick={() => openEdit(role)} sx={{ color: '#6d28d9' }}><Pencil size={18} /></IconButton></Tooltip>}
                {can('roles.delete') && <Tooltip title="Delete role"><IconButton aria-label={`Delete ${role.name}`} size="small" onClick={() => setRoleToDelete(role)} sx={{ color: '#dc2626' }}><Trash2 size={18} /></IconButton></Tooltip>}
              </Stack></TableCell>
            </TableRow>;
          })}
          {!roles.length && <TableRow><TableCell colSpan={5} align="center" sx={{ color: '#64748b', py: 4 }}>No roles found.</TableCell></TableRow>}
        </TableBody>
      </Table>
    </TableContainer>

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

    <Dialog open={Boolean(roleToDelete)} onClose={() => setRoleToDelete(null)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ color: '#0f172a' }}>Delete role?</DialogTitle>
      <DialogContent><DialogContentText>Are you sure you want to delete the {roleToDelete?.name} role? This action cannot be undone.</DialogContentText></DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => setRoleToDelete(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
        <Button variant="contained" color="error" onClick={confirmDelete} sx={{ textTransform: 'none' }}>Delete</Button>
      </DialogActions>
    </Dialog>
  </div>;
}

export default RolePage;
