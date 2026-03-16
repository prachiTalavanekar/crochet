import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const emoji = (cat) => cat === 'bouquets' ? '🌸' : cat === 'keychains' ? '🔑' : '🌼';

export default function AdminInventory() {
  const { user } = useAuth();
  const headers = { Authorization: `Bearer ${user.token}` };
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState({});

  useEffect(() => {
    axios.get('/api/admin/inventory', { headers }).then(r => setProducts(r.data));
  }, []);

  const updateStock = async (id, stock) => {
    const { data } = await axios.put(`/api/admin/inventory/${id}`, { stock: Number(stock) }, { headers });
    setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: data.stock } : p));
    setEditing(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const lowStock = products.filter(p => p.stock <= 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory</h1>

      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p className="font-semibold text-red-500 mb-2">⚠️ Low Stock Alert ({lowStock.length} items)</p>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(p => (
              <span key={p._id} className="bg-red-100 text-red-500 text-xs px-3 py-1 rounded-full">
                {p.name} — only {p.stock} left
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-pastel-100 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-pastel-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-center">Price</th>
              <th className="px-4 py-3 text-center">Stock</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pastel-50">
            {products.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">No products found.</td></tr>
            )}
            {products.map(p => (
              <tr key={p._id} className="hover:bg-pastel-50/50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{emoji(p.category)}</span>
                    <span className="font-medium text-gray-800">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-gray-500">{p.category}</td>
                <td className="px-4 py-3 text-center font-medium text-pastel-500">₹{p.price}</td>
                <td className="px-4 py-3 text-center">
                  <input type="number" min="0"
                    className="w-20 border border-pastel-200 rounded-lg px-2 py-1 text-center text-sm focus:outline-none focus:border-pastel-400"
                    value={editing[p._id] !== undefined ? editing[p._id] : p.stock}
                    onChange={e => setEditing(prev => ({ ...prev, [p._id]: e.target.value }))} />
                </td>
                <td className="px-4 py-3 text-center">
                  {p.stock === 0
                    ? <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full">Out of Stock</span>
                    : p.stock <= 5
                    ? <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">Low Stock</span>
                    : <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">In Stock</span>
                  }
                </td>
                <td className="px-4 py-3 text-center">
                  {editing[p._id] !== undefined && (
                    <button onClick={() => updateStock(p._id, editing[p._id])}
                      className="text-xs bg-pastel-400 text-white px-3 py-1.5 rounded-lg hover:bg-pastel-500 transition">
                      Save
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
