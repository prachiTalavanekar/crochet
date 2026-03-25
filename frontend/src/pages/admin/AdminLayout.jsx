import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Products', icon: '🧶' },
  { to: '/admin/categories', label: 'Categories', icon: '📂' },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
  { to: '/admin/users', label: 'Users', icon: '👤' },
  { to: '/admin/transactions', label: 'Transactions', icon: '💰' },
  { to: '/admin/inventory', label: 'Inventory', icon: '🗃️' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-56 bg-white border-r border-pastel-100 flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex`}>
        <div className="px-5 py-5 border-b border-pastel-100">
          <p className="text-lg font-bold text-pastel-500">🧶 CrochetBloom</p>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? 'bg-pastel-100 text-pastel-600' : 'text-gray-600 hover:bg-pastel-50'}`
              }
              onClick={() => setOpen(false)}>
              <span>{l.icon}</span>{l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-pastel-100">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-400 transition">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-pastel-100 px-5 py-3 flex items-center gap-3 md:hidden">
          <button onClick={() => setOpen(true)} className="text-gray-500 text-xl">☰</button>
          <p className="font-semibold text-gray-700">Admin Panel</p>
        </header>
        <main className="flex-1 p-5 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
