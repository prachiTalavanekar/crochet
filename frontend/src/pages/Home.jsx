import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/api/products').then(res => setFeatured(Array.isArray(res.data) ? res.data.slice(0, 4) : []));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-pastel-50 py-14 md:py-20 text-center px-5">
        <p className="text-pastel-400 font-medium tracking-widest text-xs md:text-sm uppercase mb-3">Handmade with love 🧶</p>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
          Beautiful Crochet <span className="text-pastel-500">Creations</span>
        </h1>
        <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm md:text-base">
          Mini bouquets, cute keychains, and lovely crochet flowers — all handcrafted with premium yarn.
        </p>
        <Link to="/shop" className="inline-block bg-pastel-400 text-white px-8 py-3 rounded-full font-medium hover:bg-pastel-500 transition shadow-sm text-sm md:text-base">
          Shop Now
        </Link>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-6 md:mb-10">Browse Categories</h2>
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {[
            { label: 'Mini Bouquets', emoji: '🌸', cat: 'bouquets', desc: 'Perfect handmade gifts' },
            { label: 'Keychains', emoji: '🔑', cat: 'keychains', desc: 'Cute accessories' },
            { label: 'Crochet Flowers', emoji: '🌼', cat: 'flowers', desc: 'For decor & gifting' },
          ].map(c => (
            <Link key={c.cat} to={`/shop?category=${c.cat}`}
              className="bg-pastel-50 border border-pastel-100 rounded-2xl p-4 md:p-8 text-center hover:shadow-md transition group">
              <div className="text-3xl md:text-5xl mb-2">{c.emoji}</div>
              <h3 className="font-bold text-gray-800 group-hover:text-pastel-500 transition text-xs md:text-base">{c.label}</h3>
              <p className="text-xs text-gray-400 mt-1 hidden md:block">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 pb-12 md:pb-16">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-6 md:mb-10">Featured Products</h2>
        {featured.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">No products yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
        <div className="text-center mt-8">
          <Link to="/shop" className="border border-pastel-300 text-pastel-500 px-6 py-2.5 rounded-full hover:bg-pastel-50 transition text-sm">
            View All Products
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-pastel-50 border-t border-pastel-100 text-center py-5 text-xs md:text-sm text-gray-400">
        © 2024 CrochetBloom · Handmade with 💗
      </footer>
    </div>
  );
}


