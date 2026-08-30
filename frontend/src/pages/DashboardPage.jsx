const stats = [
  { label: 'Total Users', value: '1,248', tone: 'blue' },
  { label: 'Active Roles', value: '12', tone: 'green' },
  { label: 'Pending Tasks', value: '18', tone: 'orange' },
  { label: 'Revenue', value: '$42.6K', tone: 'purple' },
];

const recentActivity = [
  'New staff member added to sales role',
  'Inventory policy updated by the admin',
  'Customer support queue cleared',
  'Role permissions changed for finance team',
];

function DashboardPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
        </div>
      </header>

      <section className="stats-grid">
        {stats.map((item) => (
          <div key={item.label} className={`stat-card ${item.tone}`}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Recent activity</h2>
        </div>
        <ul className="activity-list">
          {recentActivity.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default DashboardPage;
