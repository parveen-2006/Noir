import { useState } from 'react';

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
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">People</p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">User</h1>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:opacity-95"
        >
          Add user
        </button>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/25">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Users</h2>
        </div>

        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <p className="py-4 text-slate-300">No users created yet.</p>
          ) : (
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="px-3 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Email</th>
                  <th className="px-3 py-3 font-medium">Role</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const statusClass =
                    user.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-300'
                      : user.status === 'Pending'
                        ? 'bg-amber-500/10 text-amber-300'
                        : 'bg-slate-500/10 text-slate-300';

                  return (
                    <tr key={`${user.email}-${user.name}`} className="border-b border-slate-800/80">
                      <td className="px-3 py-3">{user.name}</td>
                      <td className="px-3 py-3">{user.email}</td>
                      <td className="px-3 py-3">{user.role}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {isOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4" onClick={() => setIsOpen(false)}>
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/60" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-white">Create user</h2>
              <button type="button" className="text-3xl text-slate-300" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Name</span>
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
              </label>

              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Email</span>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@noir.com" className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
              </label>

              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Password</span>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter password" className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
              </label>

              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Role</span>
                <select name="role" value={form.role} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20">
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Support</option>
                  <option>Editor</option>
                </select>
              </label>

              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Status</span>
                <select name="status" value={form.status} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20">
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95">
                  Save user
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPage;
