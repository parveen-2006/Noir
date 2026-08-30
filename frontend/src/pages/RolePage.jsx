const roles = [
  { name: 'Administrator', description: 'Full access and system configuration.', users: 5 },
  { name: 'Manager', description: 'Can manage team members and reports.', users: 8 },
  { name: 'Support', description: 'Handles customer requests and escalations.', users: 14 },
  { name: 'Editor', description: 'Can update storefront and content.', users: 10 },
];

function RolePage() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Access control</p>
          <h1>Role</h1>
        </div>
        <button className="primary-button">Create role</button>
      </header>

      <section className="role-grid">
        {roles.map((role) => (
          <article key={role.name} className="role-card">
            <div className="role-badge">{role.name}</div>
            <p>{role.description}</p>
            <div className="role-meta">
              <span>{role.users} users</span>
              <button>Manage</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default RolePage;
