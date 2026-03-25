import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';

const imgSrc = (src) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${src}`;
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveImg(0);
    api.get(`/api/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) return <p className="text-center py-20 text-gray-400">Loading...</p>;

  const categoryEmoji = product.category === 'bouquets' ? '🌸' : product.category === 'keychains' ? '🔑' : '🌼';
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="text-pastel-400 text-sm mb-6 hover:underline flex items-center gap-1">
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* Left — Image Gallery */}
        <div>
          {/* Main Image */}
          <div className="w-full aspect-square rounded-2xl overflow-hidden border border-pastel-100 bg-pastel-50 flex items-center justify-center">
            {images.length > 0
              ? <img src={imgSrc(images[activeImg])} alt={product.name} className="w-full h-full object-cover" />
              : <span className="text-8xl">{categoryEmoji}</span>}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${activeImg === i ? 'border-pastel-400' : 'border-pastel-100 hover:border-pastel-300'}`}>
                  <img src={imgSrc(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — Product Info */}
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs bg-pastel-100 text-pastel-500 px-3 py-1 rounded-full capitalize font-medium">
              {categoryEmoji} {product.category}
            </span>
            <h1 className="text-2xl font-bold text-gray-800 mt-3 leading-snug">{product.name}</h1>
            <p className="text-3xl font-bold text-pastel-500 mt-2">₹{product.price}</p>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-400'}`}>
              {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
            </span>
            {product.handmade && (
              <span className="text-xs bg-pastel-50 text-pastel-500 px-3 py-1 rounded-full">🧶 Handmade</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 mt-2">
              {/* Qty selector */}
              <div className="flex items-center border border-pastel-200 rounded-full overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-4 py-2.5 text-pastel-500 hover:bg-pastel-50 text-lg leading-none">−</button>
                <span className="px-4 text-gray-700 font-semibold min-w-[2rem] text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="px-4 py-2.5 text-pastel-500 hover:bg-pastel-50 text-lg leading-none">+</button>
              </div>

              <button onClick={handleAdd}
                className={`flex-1 py-3 rounded-full font-semibold text-sm transition ${added ? 'bg-green-400 text-white' : 'bg-pastel-400 text-white hover:bg-pastel-500'}`}>
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
            </div>
          )}

          {/* Delivery info */}
          <div className="border border-pastel-100 rounded-2xl p-4 bg-pastel-50 text-sm text-gray-500 space-y-1 mt-2">
            <p>🚚 Free delivery on orders above ₹499</p>
            <p>📦 Carefully packed handmade item</p>
            <p>↩️ Easy returns within 7 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}



