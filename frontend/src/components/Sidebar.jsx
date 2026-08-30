import { LayoutDashboard, LogOut, ShieldCheck, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'User', icon: Users },
  { to: '/roles', label: 'Role', icon: ShieldCheck },
];

function Sidebar({ onLogout }) {
  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900/90 p-5 backdrop-blur-sm">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 font-bold text-white">
          N
        </div>
        <div>
          <p className="text-base font-bold tracking-[0.18em] text-white">NOIR</p>
          <span className="text-xs text-slate-400">Admin</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col justify-between gap-2">
        <div className="space-y-2">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  isActive
                    ? 'bg-violet-500/15 text-white ring-1 ring-violet-500/30'
                    : 'text-slate-300 hover:bg-violet-500/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-auto border-t border-slate-800 pt-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 transition hover:bg-red-500/10 hover:text-red-300 hover:ring-1 hover:ring-red-500/30"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
