import { LayoutDashboard, LogOut, ShieldCheck, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'User', icon: Users },
  { to: '/roles', label: 'Role', icon: ShieldCheck },
];

function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">N</div>
        <div>
          <p className="brand-name">NOIR</p>
          <span className="brand-subtitle">Admin</span>
        </div>
      </div>

      <nav className="nav">
        <div className="nav-menu">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="sidebar-footer">
          <button type="button" className="logout-button" onClick={onLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
