import { Link } from 'react-router-dom';

const imgSrc = (src) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${src}`;
};

export default function ProductCard({ product }) {
  const emoji = product.category === 'bouquets' ? '🌸' : product.category === 'keychains' ? '🔑' : '🌼';
  const thumb = product.images?.[0] || product.image;

  return (
    <Link to={`/product/${product._id}`}
      className="bg-white rounded-2xl border border-pastel-100 hover:shadow-md transition overflow-hidden group flex flex-col">

      {/* Fixed square image area */}
      <div className="w-full aspect-square bg-pastel-50 overflow-hidden flex items-center justify-center">
        {thumb
          ? <img
              src={imgSrc(thumb)}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          : <span className="text-5xl">{emoji}</span>
        }
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        <h3 className="font-semibold text-gray-800 group-hover:text-pastel-500 transition text-sm leading-snug line-clamp-2">
          {product.name}
        </h3>
        <p className="text-pastel-500 font-bold text-base">₹{product.price}</p>
        <p className="text-xs text-gray-400">
          {product.stock > 0 ? `${product.stock} in stock` : <span className="text-red-400">Out of stock</span>}
        </p>
      </div>
    </Link>
  );
}

