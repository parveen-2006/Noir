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
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Access control</p>
          <h1>Role</h1>
        </div>
        <button className="primary-button" onClick={() => setIsOpen(true)}>
          Create role
        </button>
      </header>

      <section className="role-grid">
        {roles.length === 0 ? (
          <div className="panel empty-role-panel">
            <p>No roles created yet.</p>
          </div>
        ) : (
          roles.map((role) => (
            <article key={`${role.name}-${role.email || 'role'}`} className="role-card">
              <div className="role-badge">{role.name}</div>
              <p>{role.description}</p>
              <div className="role-meta">
                <span>{role.users} users</span>
                <button>Manage</button>
              </div>
            </article>
          ))
        )}
      </section>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="panel-header">
              <h2>Create role</h2>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>

            <form className="user-form" onSubmit={handleSubmit}>
              <label>
                <span>Name</span>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Role name" />
              </label>

              <label>
                <span>Email</span>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="role@noir.com" />
              </label>

              <label>
                <span>Password</span>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter password" />
              </label>

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setIsOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
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
