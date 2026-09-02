import { Menu } from 'lucide-react';

function Navbar({ user, onToggleSidebar }) {
  return (
    <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-slate-200 px-8">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
        className="grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
      >
        <Menu size={22} />
      </button>

      <div className="text-right">
        <p className="text-sm font-semibold text-slate-900">{user?.name || user?.email || 'User'}</p>
        <p className="text-xs capitalize text-slate-500">{user?.role || 'Member'}</p>
      </div>
    </header>
  );
}

export default Navbar;