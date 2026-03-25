import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const empty = { name: '', description: '', price: '', category: 'bouquets', stock: '', images: [] };
const emoji = (cat) => cat === 'bouquets' ? '🌸' : cat === 'keychains' ? '🔑' : '🌼';

export default function AdminProducts() {
  const { user } = useAuth();
  const headers = { Authorization: `Bearer ${user.token}` };
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [filter, setFilter] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const fileRef = useRef();

  const load = () => axios.get('/api/products').then(r => setProducts(r.data));
  useEffect(() => { load(); }, []);

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  // Handle image files selected from device
  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Show local previews immediately
    const localPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...localPreviews]);

    // Upload to server
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const { data } = await axios.post('/api/upload', fd, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      setForm(prev => ({ ...prev, images: [...prev.images, ...data.urls] }));
      flash(`✓ ${data.urls.length} image(s) uploaded`);
    } catch {
      flash('Upload failed. Try again.', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, image: form.images[0] || '' };
      if (editId) {
        await axios.put(`/api/admin/products/${editId}`, payload, { headers });
        flash('✓ Product updated');
      } else {
        await axios.post('/api/admin/products', payload, { headers });
        flash('✓ Product added');
      }
      setForm(empty); setEditId(null); setPreviews([]); load();
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await axios.delete(`/api/admin/products/${id}`, { headers });
    load();
  };

  const startEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, images: p.images || (p.image ? [p.image] : []) });
    setPreviews(p.images?.length ? p.images.map(img => img.startsWith('/uploads') ? `http://localhost:5000${img}` : img) : p.image ? [`http://localhost:5000${p.image}`] : []);
    setEditId(p._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = filter ? products.filter(p => p.category === filter) : products;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Products</h1>
      <div className="grid md:grid-cols-2 gap-8">

        {/* Form */}
        <div className="bg-white rounded-2xl border border-pastel-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-4">{editId ? '✏️ Edit Product' : '➕ Add New Product'}</h2>

          {msg.text && (
            <p className={`text-sm mb-3 p-3 rounded-xl ${msg.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-pastel-50 text-pastel-600'}`}>
              {msg.text}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input placeholder="Product Name *" required
              className="w-full border border-pastel-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pastel-400"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

            <select className="w-full border border-pastel-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pastel-400"
              value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="bouquets">🌸 Mini Crochet Flower Bouquets</option>
              <option value="keychains">🔑 Crochet Keychains</option>
              <option value="flowers">🌼 Crochet Flowers</option>
            </select>

            <textarea placeholder="Description *" required rows={3} style={{ resize: 'none' }}
              className="w-full border border-pastel-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pastel-400"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Price ₹ *" required min="1"
                className="border border-pastel-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pastel-400"
                value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              <input type="number" placeholder="Stock *" required min="0"
                className="border border-pastel-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pastel-400"
                value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            </div>

            {/* Image Upload */}
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">Product Images (up to 10)</p>

              {/* Preview Grid */}
              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img src={src} alt="" className="w-full h-full object-cover rounded-xl border border-pastel-100" />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-pastel-400 text-white text-[10px] px-1.5 py-0.5 rounded-full">Cover</span>
                      )}
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-400 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Add more button */}
                  {previews.length < 10 && (
                    <button type="button" onClick={() => fileRef.current.click()}
                      className="aspect-square border-2 border-dashed border-pastel-200 rounded-xl flex items-center justify-center text-pastel-300 hover:border-pastel-400 hover:text-pastel-400 transition text-2xl">
                      +
                    </button>
                  )}
                </div>
              )}

              {/* Upload Drop Zone */}
              {previews.length === 0 && (
                <div onClick={() => fileRef.current.click()}
                  className="border-2 border-dashed border-pastel-200 rounded-xl p-6 text-center cursor-pointer hover:border-pastel-400 hover:bg-pastel-50 transition">
                  {uploading ? (
                    <p className="text-pastel-400 text-sm">Uploading...</p>
                  ) : (
                    <>
                      <p className="text-3xl mb-2">📷</p>
                      <p className="text-sm text-gray-500">Click to upload images from device</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · Max 5MB each · Up to 10 images</p>
                    </>
                  )}
                </div>
              )}

              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                onChange={handleFiles} />

              {uploading && (
                <p className="text-xs text-pastel-400 mt-2 text-center animate-pulse">Uploading images...</p>
              )}
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={uploading}
                className="flex-1 bg-pastel-400 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-pastel-500 transition disabled:opacity-60">
                {editId ? 'Update Product' : 'Add Product'}
              </button>
              {editId && (
                <button type="button" onClick={() => { setForm(empty); setEditId(null); setPreviews([]); }}
                  className="px-4 border border-pastel-200 rounded-xl text-sm text-gray-500 hover:bg-pastel-50">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product List */}
        <div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {['', 'bouquets', 'keychains', 'flowers'].map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${filter === c ? 'bg-pastel-400 text-white border-pastel-400' : 'bg-white text-gray-500 border-pastel-200 hover:border-pastel-400'}`}>
                {c === '' ? 'All' : `${emoji(c)} ${c}`}
              </button>
            ))}
          </div>
          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {filtered.length === 0 && <p className="text-gray-400 text-sm text-center py-10">No products found.</p>}
            {filtered.map(p => {
              const thumb = p.images?.[0] || p.image;
              return (
                <div key={p._id} className="flex items-center gap-3 bg-white border border-pastel-100 rounded-xl p-3 hover:shadow-sm transition">
                  <div className="w-12 h-12 bg-pastel-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                    {thumb
                      ? <img src={thumb.startsWith('/uploads') ? `http://localhost:5000${thumb}` : thumb} alt="" className="w-full h-full object-cover" />
                      : emoji(p.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">
                      ₹{p.price} · Stock: <span className={p.stock <= 5 ? 'text-red-400 font-semibold' : ''}>{p.stock}</span>
                      {p.images?.length > 1 && <span className="ml-1 text-pastel-400">· {p.images.length} photos</span>}
                    </p>
                  </div>
                  <button onClick={() => startEdit(p)} className="text-xs text-pastel-500 hover:underline px-1">Edit</button>
                  <button onClick={() => del(p._id)} className="text-xs text-red-400 hover:underline px-1">Delete</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
