import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'bouquets', label: '🌸 Bouquets' },
  { value: 'keychains', label: '🔑 Keychains' },
  { value: 'flowers', label: '🌼 Flowers' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const url = category ? `/api/products?category=${category}` : '/api/products';
    axios.get(url).then(res => { setProducts(res.data); setLoading(false); });
  }, [category]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-5 md:mb-8">Shop</h1>

      {/* Category Filter — scrollable on mobile */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(c => (
          <button key={c.value}
            onClick={() => setSearchParams(c.value ? { category: c.value } : {})}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition border ${
              category === c.value
                ? 'bg-pastel-400 text-white border-pastel-400'
                : 'bg-white text-gray-600 border-pastel-200 hover:border-pastel-400'
            }`}>
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-pastel-50 rounded-2xl aspect-square animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 py-20 text-sm">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
