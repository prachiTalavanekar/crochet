import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => {
    axios.get('/api/admin/stats', { headers }).then(r => setStats(r.data));
  }, []);

  const cards = stats ? [
    { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'bg-blue-50 text-blue-600', link: '/admin/orders' },
    { label: 'Total Users', value: stats.totalUsers, icon: '👤', color: 'bg-purple-50 text-purple-600', link: '/admin/users' },
    { label: 'Total Products', value: stats.totalProducts, icon: '🧶', color: 'bg-pastel-50 text-pastel-600', link: '/admin/products' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: 'bg-green-50 text-green-600', link: '/admin/transactions' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: 'bg-yellow-50 text-yellow-600', link: '/admin/orders' },
    { label: "Today's Orders", value: stats.todayOrders, icon: '📅', color: 'bg-orange-50 text-orange-600', link: '/admin/orders' },
    { label: "Today's Revenue", value: `₹${stats.todayRevenue?.toLocaleString()}`, icon: '📈', color: 'bg-teal-50 text-teal-600', link: '/admin/transactions' },
  ] : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {!stats ? (
        <p className="text-gray-400">Loading stats...</p>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {cards.map(c => (
              <Link to={c.link} key={c.label}
                className={`${c.color} rounded-2xl p-4 hover:shadow-md transition`}>
                <p className="text-2xl mb-1">{c.icon}</p>
                <p className="text-2xl font-bold">{c.value}</p>
                <p className="text-xs font-medium mt-1 opacity-70">{c.label}</p>
              </Link>
            ))}
          </div>

          {/* Top Products */}
          {stats.topProducts?.length > 0 && (
            <div className="bg-white rounded-2xl border border-pastel-100 p-5 mb-6">
              <h2 className="font-semibold text-gray-700 mb-4">🏆 Top Selling Products</h2>
              <div className="space-y-3">
                {stats.topProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-pastel-400 w-5">#{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{p.name}</span>
                        <span className="text-gray-400">{p.sold} sold</span>
                      </div>
                      <div className="h-2 bg-pastel-50 rounded-full overflow-hidden">
                        <div className="h-full bg-pastel-300 rounded-full"
                          style={{ width: `${Math.min(100, (p.sold / (stats.topProducts[0]?.sold || 1)) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
