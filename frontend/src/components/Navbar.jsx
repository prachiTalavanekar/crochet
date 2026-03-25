import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const imgSrc = (src) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${src}`;
};

function Avatar({ user, size = 'sm' }) {
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const dim = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-sm';
  return (
    <div className={`${dim} rounded-full overflow-hidden bg-pastel-200 flex items-center justify-center font-bold text-pastel-600 flex-shrink-0`}>
      {user?.avatar
        ? <img src={imgSrc(user.avatar)} alt="" className="w-full h-full object-cover" />
        : <span>{initials}</span>}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const close = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-pastel-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" onClick={close} className="text-xl font-bold text-pastel-500 tracking-wide">
          🧶 CrochetBloom
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-pastel-500 transition">Home</Link>
          <Link to="/shop" className="hover:text-pastel-500 transition">Shop</Link>
          {user?.isAdmin && <Link to="/admin" className="hover:text-pastel-500 transition">Admin</Link>}

          {/* Cart */}
          <Link to="/cart" className="relative hover:text-pastel-500 transition text-lg">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pastel-400 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 hover:text-pastel-500 transition">
                <Avatar user={user} />
                <span className="max-w-[80px] truncate">{user.name?.split(' ')[0]}</span>
              </Link>
              <Link to="/orders" className="hover:text-pastel-500 transition">Orders</Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="bg-pastel-400 text-white px-4 py-1.5 rounded-full hover:bg-pastel-500 transition">
              Login
            </Link>
          )}
        </div>

        {/* Mobile right */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/cart" className="relative text-xl">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pastel-400 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </Link>
          {user && <Link to="/profile"><Avatar user={user} /></Link>}
          <button onClick={() => setMenuOpen(o => !o)} className="text-gray-500 text-2xl leading-none">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-pastel-100 px-4 py-3 flex flex-col gap-1 text-sm font-medium text-gray-600">
          <Link to="/" onClick={close} className="py-2.5 hover:text-pastel-500 border-b border-pastel-50">Home</Link>
          <Link to="/shop" onClick={close} className="py-2.5 hover:text-pastel-500 border-b border-pastel-50">Shop</Link>
          {user?.isAdmin && <Link to="/admin" onClick={close} className="py-2.5 hover:text-pastel-500 border-b border-pastel-50">Admin</Link>}
          {user && (
            <>
              <Link to="/profile" onClick={close} className="py-2.5 hover:text-pastel-500 border-b border-pastel-50 flex items-center gap-2">
                <Avatar user={user} /> Edit Profile
              </Link>
              <Link to="/orders" onClick={close} className="py-2.5 hover:text-pastel-500 border-b border-pastel-50">My Orders</Link>
              <button onClick={handleLogout} className="py-2.5 text-left text-red-400 hover:text-red-500">Logout</button>
            </>
          )}
          {!user && (
            <Link to="/login" onClick={close} className="py-2.5 bg-pastel-400 text-white text-center rounded-full hover:bg-pastel-500 mt-1">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

