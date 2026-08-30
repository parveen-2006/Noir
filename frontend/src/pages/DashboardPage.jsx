const stats = [
  { label: 'Total Users', value: '1,248', tone: 'text-blue-400' },
  { label: 'Active Roles', value: '12', tone: 'text-emerald-400' },
  { label: 'Pending Tasks', value: '18', tone: 'text-amber-300' },
  { label: 'Revenue', value: '$42.6K', tone: 'text-violet-300' },
];

const recentActivity = [
  'New staff member added to sales role',
  'Inventory policy updated by the admin',
  'Customer support queue cleared',
  'Role permissions changed for finance team',
];

function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Overview</p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Dashboard</h1>
        </div>
      </header>

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/25">
            <span className="text-sm text-slate-300">{item.label}</span>
            <strong className={`mt-3 block text-3xl font-bold ${item.tone}`}>{item.value}</strong>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/25">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Recent activity</h2>
        </div>
        <ul className="space-y-3">
          {recentActivity.map((item) => (
            <li key={item} className="rounded-xl bg-slate-800/70 px-4 py-3 text-slate-200">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default DashboardPage;
