import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const STATUS = ['Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLOR = {
  Processing: 'bg-yellow-100 text-yellow-700',
  Packed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-500',
};

export default function AdminOrders() {
  const { user } = useAuth();
  const headers = { Authorization: `Bearer ${user.token}` };
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/admin/orders', { headers }).then(r => setOrders(r.data));
  }, []);

  const updateStatus = async (id, orderStatus) => {
    const { data } = await axios.put(`/api/admin/orders/${id}`, { orderStatus }, { headers });
    setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: data.orderStatus } : o));
    if (selected?._id === id) setSelected({ ...selected, orderStatus: data.orderStatus });
  };

  const del = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    await axios.delete(`/api/admin/orders/${id}`, { headers });
    setOrders(prev => prev.filter(o => o._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const filtered = orders.filter(o => {
    const matchStatus = filter ? o.orderStatus === filter : true;
    const matchSearch = search ? (o.user?.name?.toLowerCase().includes(search.toLowerCase()) || o._id.includes(search)) : true;
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input placeholder="Search by customer or order ID..."
          className="border border-pastel-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-pastel-400 w-64"
          value={search} onChange={e => setSearch(e.target.value)} />
        {['', ...STATUS].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${filter === s ? 'bg-pastel-400 text-white border-pastel-400' : 'bg-white text-gray-500 border-pastel-200 hover:border-pastel-400'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Order List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filtered.length === 0 && <p className="text-gray-400 text-sm text-center py-10">No orders found.</p>}
          {filtered.map(o => (
            <div key={o._id}
              onClick={() => setSelected(o)}
              className={`bg-white border rounded-xl p-4 cursor-pointer hover:shadow-sm transition ${selected?._id === o._id ? 'border-pastel-400' : 'border-pastel-100'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{o.user?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-400">#{o._id.slice(-6).toUpperCase()} · {new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[o.orderStatus]}`}>{o.orderStatus}</span>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-500">{o.items.length} item(s)</span>
                <span className="font-semibold text-pastel-500">₹{o.totalPrice}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Detail */}
        {selected ? (
          <div className="bg-white border border-pastel-100 rounded-2xl p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold text-gray-800">Order #{selected._id.slice(-6).toUpperCase()}</p>
                <p className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500">✕</button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-pastel-50 rounded-xl p-3">
                <p className="font-medium text-gray-700 mb-1">👤 Customer</p>
                <p>{selected.user?.name}</p>
                <p className="text-gray-400">{selected.user?.email}</p>
              </div>

              <div className="bg-pastel-50 rounded-xl p-3">
                <p className="font-medium text-gray-700 mb-1">📍 Shipping</p>
                <p>{selected.shipping?.name} · {selected.shipping?.phone}</p>
                <p className="text-gray-400">{selected.shipping?.address}, {selected.shipping?.city}, {selected.shipping?.state} - {selected.shipping?.pincode}</p>
              </div>

              <div className="bg-pastel-50 rounded-xl p-3">
                <p className="font-medium text-gray-700 mb-2">🛍️ Items</p>
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-600">{item.name} ×{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-pastel-200 mt-2 pt-2 flex justify-between font-semibold">
                  <span>Total</span><span className="text-pastel-500">₹{selected.totalPrice}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-600 text-sm">Status:</span>
                <select value={selected.orderStatus}
                  onChange={e => updateStatus(selected._id, e.target.value)}
                  className="flex-1 border border-pastel-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pastel-400">
                  {STATUS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <button onClick={() => del(selected._id)}
                className="w-full py-2 border border-red-200 text-red-400 rounded-xl text-sm hover:bg-red-50 transition">
                Delete Order
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-pastel-50 border border-pastel-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm h-48">
            Click an order to view details
          </div>
        )}
      </div>
    </div>
  );
}
