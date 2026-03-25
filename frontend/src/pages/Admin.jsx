import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['Processing', 'Packed', 'Shipped', 'Delivered'];
const CATEGORIES = ['bouquets', 'keychains', 'flowers'];
const EMOJI = { bouquets: '🌸', keychains: '🔑', flowers: '🌼' };
const STATUS_COLOR = {
  Processing: 'bg-yellow-100 text-yellow-600',
  Packed: 'bg-blue-100 text-blue-600',
  Shipped: 'bg-purple-100 text-purple-600',
  Delivered: 'bg-green-100 text-green-600',
};

const emptyProduct = { name: '', description: '', price: '', category: 'bouquets', stock: '', image: '' };

export default function Admin() {
  const { user } = useAuth();
  const headers = { Authorization: `Bearer ${user.token}` };
  const [tab, setTab] = useState('dashboard');

  // Dashboard
  const [stats, setStats] = useState(null);

  // Orders
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('');

  // Users
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  // Products
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editId, setEditId] = useState(null);
  const [productMsg, setProductMsg] = useState('');
  const [catFilter, setCatFilter] = useState('');

  useEffect(() => {
    if (tab === 'dashboard') {
      api.get('/api/admin/stats', { headers }).then(r => setStats(r.data));
    } else if (tab === 'orders') {
      api.get('/api/admin/orders', { headers }).then(r => setOrders(Array.isArray(r.data) ? r.data : []));
    } else if (tab === 'users') {
      api.get('/api/admin/users', { headers }).then(r => setUsers(Array.isArray(r.data) ? r.data : []));
    } else if (tab === 'products') {
      api.get('/api/products').then(r => setProducts(Array.isArray(r.data) ? r.data : []));
    }
  }, [tab]);

  // ── ORDER ACTIONS ──
  const updateStatus = async (id, orderStatus) => {
    const { data } = await api.put(`/api/admin/orders/${id}`, { orderStatus }, { headers });
    setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: data.orderStatus } : o));
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    await api.delete(`/api/admin/orders/${id}`, { headers });
    setOrders(prev => prev.filter(o => o._id !== id));
  };

  // ── USER ACTIONS ──
  const toggleAdmin = async (id, isAdmin) => {
    const { data } = await api.put(`/api/admin/users/${id}`, { isAdmin: !isAdmin }, { headers });
    setUsers(prev => prev.map(u => u._id === id ? { ...u, isAdmin: data.isAdmin } : u));
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/api/admin/users/${id}`, { headers });
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  // ── PRODUCT ACTIONS ──
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/admin/products/${editId}`, form, { headers });
        setProductMsg('✓ Product updated!');
      } else {
        await api.post('/api/admin/products', form, { headers });
        setProductMsg('✓ Product added!');
      }
      setForm(emptyProduct);
      setEditId(null);
      const res = await api.get('/api/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
      setTimeout(() => setProductMsg(''), 3000);
    } catch (err) {
      setProductMsg(err.response?.data?.message || 'Error saving product');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/api/admin/products/${id}`, { headers });
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  const startEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, image: p.image || '' });
    setEditId(p._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── FILTERED LISTS ──
  const filteredOrders = orders.filter(o => {
    const matchSearch = o._id.includes(orderSearch) || o.user?.name?.toLowerCase().includes(orderSearch.toLowerCase());
    const matchStatus = orderFilter ? o.orderStatus === orderFilter : true;
    return matchSearch && matchStatus;
  });

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProducts = catFilter ? products.filter(p => p.category === catFilter) : products;

  const TABS = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'orders', label: '📦 Orders' },
    { key: 'users', label: '👥 Users' },
    { key: 'products', label: '🧶 Products' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-pastel-100 pb-4">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              tab === t.key ? 'bg-pastel-400 text-white shadow-sm' : 'bg-pastel-50 text-gray-600 hover:bg-pastel-100'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {tab === 'dashboard' && (
        <div>
          {!stats ? <p className="text-gray-400 text-center py-10">Loading...</p> : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {[
                  { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, color: 'text-pastel-500' },
                  { label: 'Total Orders', value: stats.totalOrders, color: 'text-blue-500' },
                  { label: 'Pending Orders', value: stats.pendingOrders, color: 'text-yellow-500' },
                  { label: 'Total Users', value: stats.totalUsers, color: 'text-purple-500' },
                  { label: 'Products', value: stats.totalProducts, color: 'text-green-500' },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-pastel-100 rounded-2xl p-5 shadow-sm text-center">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-pastel-50 border border-pastel-100 rounded-2xl p-6 text-center text-gray-400 text-sm">
                Use the tabs above to manage orders, users, and products.
              </div>
            </>
          )}
        </div>
      )}

      {/* ── ORDERS ── */}
      {tab === 'orders' && (
        <div>
          <div className="flex flex-wrap gap-3 mb-5">
            <input placeholder="Search by name or order ID..."
              className="border border-pastel-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-pastel-400 flex-1 min-w-48"
              value={orderSearch} onChange={e => setOrderSearch(e.target.value)} />
            <select className="border border-pastel-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-pastel-400"
              value={orderFilter} onChange={e => setOrderFilter(e.target.value)}>
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <p className="text-xs text-gray-400 mb-4">{filteredOrders.length} orders</p>

          {filteredOrders.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No orders found.</p>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div key={order._id} className="bg-white border border-pastel-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">{order.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        #{order._id.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString()}
       

