import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const { user } = useAuth();
  const headers = { Authorization: `Bearer ${user.token}` };
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/admin/users', { headers }).then(r => setUsers(r.data));
  }, []);

  const toggleAdmin = async (u) => {
    const { data } = await axios.put(`/api/admin/users/${u._id}`, { isAdmin: !u.isAdmin }, { headers });
    setUsers(prev => prev.map(x => x._id === u._id ? { ...x, isAdmin: data.isAdmin } : x));
  };

  const toggleBlock = async (u) => {
    const { data } = await axios.put(`/api/admin/users/${u._id}`, { blocked: !u.blocked }, { headers });
    setUsers(prev => prev.map(x => x._id === u._id ? { ...x, blocked: data.blocked } : x));
  };

  const del = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await axios.delete(`/api/admin/users/${id}`, { headers });
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Users</h1>

      <input placeholder="Search by name or email..."
        className="border border-pastel-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pastel-400 w-full max-w-sm mb-5"
        value={search} onChange={e => setSearch(e.target.value)} />

      <div className="bg-white border border-pastel-100 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-pastel-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Orders</th>
              <th className="px-4 py-3 text-center">Role</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pastel-50">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">No users found.</td></tr>
            )}
            {filtered.map(u => (
              <tr key={u._id} className="hover:bg-pastel-50/50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-pastel-100 rounded-full flex items-center justify-center text-pastel-500 font-bold text-xs">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-pastel-50 text-pastel-600 px-2 py-0.5 rounded-full text-xs font-medium">{u.orderCount || 0}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleAdmin(u)}
                    className={`text-xs px-2 py-1 rounded-full font-medium transition ${u.isAdmin ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {u.isAdmin ? 'Admin' : 'User'}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleBlock(u)}
                    className={`text-xs px-2 py-1 rounded-full font-medium transition ${u.blocked ? 'bg-red-100 text-red-500 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
                    {u.blocked ? 'Blocked' : 'Active'}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => del(u._id)} className="text-xs text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
