import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const empty = { name: '', slug: '', emoji: '🧶', description: '' };

export default function AdminCategories() {
  const { user } = useAuth();
  const headers = { Authorization: `Bearer ${user.token}` };
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => axios.get('/api/categories').then(r => setCats(r.data));
  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/categories/${editId}`, form, { headers });
        flash('✓ Category updated');
      } else {
        await axios.post('/api/categories', form, { headers });
        flash('✓ Category added');
      }
      setForm(empty); setEditId(null); load();
    } catch (err) { flash(err.response?.data?.message || 'Error'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await axios.delete(`/api/categories/${id}`, { headers });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Categories</h1>
      <div className="grid md:grid-cols-2 gap-8">

        {/* Form */}
        <div className="bg-white rounded-2xl border border-pastel-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-4">{editId ? '✏️ Edit Category' : '➕ Add Category'}</h2>
          {msg && <p className="text-sm mb-3 bg-pastel-50 text-pastel-600 p-3 rounded-xl">{msg}</p>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input placeholder="Category Name *" required
              className="w-full border border-pastel-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pastel-400"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Slug (e.g. bouquets) *" required
              className="w-full border border-pastel-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pastel-400"
              value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
            <input placeholder="Emoji (e.g. 🌸)"
              className="w-full border border-pastel-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pastel-400"
              value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} />
            <input placeholder="Description"
              className="w-full border border-pastel-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pastel-400"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-pastel-400 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-pastel-500 transition">
                {editId ? 'Update' : 'Add Category'}
              </button>
              {editId && (
                <button type="button" onClick={() => { setForm(empty); setEditId(null); }}
                  className="px-4 border border-pastel-200 rounded-xl text-sm text-gray-500 hover:bg-pastel-50">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="space-y-3">
          {cats.length === 0 && (
            <div className="bg-white border border-pastel-100 rounded-2xl p-8 text-center text-gray-400 text-sm">
              No categories yet. Add your first one.
            </div>
          )}
          {cats.map(c => (
            <div key={c._id} className="bg-white border border-pastel-100 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition">
              <span className="text-3xl">{c.emoji}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-400">/{c.slug} {c.description && `· ${c.description}`}</p>
              </div>
              <button onClick={() => { setForm({ name: c.name, slug: c.slug, emoji: c.emoji, description: c.description || '' }); setEditId(c._id); }}
                className="text-xs text-pastel-500 hover:underline px-1">Edit</button>
              <button onClick={() => del(c._id)} className="text-xs text-red-400 hover:underline px-1">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
