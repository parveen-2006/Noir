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
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">People</p>
          <h1>User</h1>
        </div>
        <button className="primary-button" onClick={() => setIsOpen(true)}>
          Add user
        </button>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h2>Users</h2>
        </div>

        <div className="table-wrap">
          {users.length === 0 ? (
            <p className="empty-state">No users created yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={`${user.email}-${user.name}`}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`status ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="panel-header">
              <h2>Create user</h2>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>

            <form className="user-form" onSubmit={handleSubmit}>
              <label>
                <span>Name</span>
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
              </label>

              <label>
                <span>Email</span>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@noir.com" />
              </label>

              <label>
                <span>Password</span>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter password" />
              </label>

              <label>
                <span>Role</span>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Support</option>
                  <option>Editor</option>
                </select>
              </label>

              <label>
                <span>Status</span>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setIsOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
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
