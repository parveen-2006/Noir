import { LayoutDashboard, LogOut, ShieldCheck, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'User', icon: Users },
  { to: '/roles', label: 'Role', icon: ShieldCheck },
];

function Sidebar({ onLogout, can, collapsed, onExpand }) {
  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} fixed inset-y-0 left-0 z-30 flex h-screen flex-col overflow-hidden border-r border-slate-200 bg-white shadow-sm transition-[width] duration-300 ease-in-out`}>
      <div className={`flex h-17.5 items-center gap-3 border-b border-slate-200 px-5 transition-[padding] duration-300 ease-in-out ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-pink-500 font-bold text-white">
          N
        </div>
        {!collapsed && <div>
          <p className="text-base font-bold tracking-[0.18em] text-slate-900">NOIR</p>
          <span className="text-xs text-slate-500">Admin</span>
        </div>}
      </div>

      <nav className={`flex flex-1 flex-col justify-between gap-2 transition-[padding] duration-300 ease-in-out ${collapsed ? 'p-2' : 'p-5'}`}>
        <div className="space-y-2">
          {items.filter(({ to }) => can(to === '/' ? 'dashboard.view' : `${to.slice(1)}.view`)).map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => { if (collapsed) onExpand(); }}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${collapsed ? 'justify-center' : ''} ${
                  isActive
                    ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-200'
                    : 'text-slate-600 hover:bg-violet-50 hover:text-violet-700'
                }`
              }
            >
              <Icon size={20} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </div>

        <div className="mt-auto border-t border-slate-200 pt-3">
          <button
            type="button"
            onClick={onLogout}
            aria-label="Logout"
            title={collapsed ? 'Logout' : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 transition hover:bg-red-50 hover:text-red-700 hover:ring-1 hover:ring-red-200 ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
