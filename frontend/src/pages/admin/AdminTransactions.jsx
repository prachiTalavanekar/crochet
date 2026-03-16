import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLOR = {
  Success: 'bg-green-100 text-green-600',
  Pending: 'bg-yellow-100 text-yellow-600',
  Failed: 'bg-red-100 text-red-500',
};

export default function AdminTransactions() {
  const { user } = useAuth();
  const headers = { Authorization: `Bearer ${user.token}` };
  const [txns, setTxns] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/admin/transactions', { headers }).then(r => setTxns(r.data));
  }, []);

  const filtered = txns.filter(t => {
    const matchStatus = filter ? t.status === filter : true;
    const matchSearch = search
      ? t.customer?.toLowerCase().includes(search.toLowerCase()) || t.txnId.includes(search) || t.orderId.includes(search)
      : true;
    return matchStatus && matchSearch;
  });

  const total = filtered.filter(t => t.status === 'Success').reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Transactions</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Transactions', value: txns.length, color: 'bg-blue-50 text-blue-600' },
          { label: 'Successful', value: txns.filter(t => t.status === 'Success').length, color: 'bg-green-50 text-green-600' },
          { label: 'Revenue Collected', value: `₹${txns.filter(t => t.status === 'Success').reduce((s, t) => s + t.amount, 0).toLocaleString()}`, color: 'bg-pastel-50 text-pastel-600' },
        ].map(c => (
          <div key={c.label} className={`${c.color} rounded-2xl p-4`}>
            <p className="text-xl font-bold">{c.value}</p>
            <p className="text-xs font-medium mt-1 opacity-70">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input placeholder="Search by customer, TXN or order ID..."
          className="border border-pastel-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-pastel-400 w-72"
          value={search} onChange={e => setSearch(e.target.value)} />
        {['', 'Success', 'Pending', 'Failed'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${filter === s ? 'bg-pastel-400 text-white border-pastel-400' : 'bg-white text-gray-500 border-pastel-200 hover:border-pastel-400'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="bg-white border border-pastel-100 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-pastel-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">TXN ID</th>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-center">Amount</th>
              <th className="px-4 py-3 text-center">Method</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pastel-50">
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No transactions found.</td></tr>
            )}
            {filtered.map(t => (
              <tr key={t.txnId} className="hover:bg-pastel-50/50 transition">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.txnId}</td>
                <td className="px-4 py-3 font-mono text-xs text-pastel-500">#{t.orderId}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{t.customer}</p>
                  <p className="text-xs text-gray-400">{t.email}</p>
                </td>
                <td className="px-4 py-3 text-center font-semibold text-gray-700">₹{t.amount}</td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase">{t.method}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[t.status]}`}>{t.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
