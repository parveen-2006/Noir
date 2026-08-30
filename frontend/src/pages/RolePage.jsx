import { useState } from 'react';

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
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Access control</p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Role</h1>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:opacity-95"
        >
          Create role
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-slate-300 md:col-span-2 xl:col-span-3">
            No roles created yet.
          </div>
        ) : (
          roles.map((role) => (
            <article key={`${role.name}-${role.email || 'role'}`} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/25">
              <div className="mb-4 inline-flex rounded-full bg-violet-500/10 px-3 py-1 text-sm font-semibold text-violet-300">
                {role.name}
              </div>
              <p className="mb-5 text-sm text-slate-300">{role.description}</p>
              <div className="flex items-center justify-between gap-3 text-sm text-sky-300">
                <span>{role.users ?? 0} users</span>
                <button type="button" className="text-white hover:text-violet-300">
                  Manage
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      {isOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4" onClick={() => setIsOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/60" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-white">Create role</h2>
              <button type="button" className="text-3xl text-slate-300" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Name</span>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Role name" className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
              </label>

              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Email</span>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="role@noir.com" className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
              </label>

              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Password</span>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter password" className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95">
                  Save role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RolePage;
