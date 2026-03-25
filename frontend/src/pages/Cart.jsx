import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const imgSrc = (src) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${src}`;
};

export default function Cart() {
  const { cart, updateQty, removeFromCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) return navigate('/login');
    navigate('/checkout');
  };

  if (cart.length === 0) return (
    <div className="text-center py-24 px-4">
      <p className="text-5xl mb-4">🛒</p>
      <p className="text-gray-400 mb-6 text-sm">Your cart is empty</p>
      <Link to="/shop" className="bg-pastel-400 text-white px-6 py-2.5 rounded-full hover:bg-pastel-500 transition text-sm">
        Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-5 md:mb-8">Your Cart</h1>

      <div className="space-y-3">
        {cart.map(item => {
          const thumb = item.images?.[0] || item.image;
          const emoji = item.category === 'bouquets' ? '🌸' : item.category === 'keychains' ? '🔑' : '🌼';
          return (
            <div key={item._id} className="flex items-center gap-3 bg-white border border-pastel-100 rounded-2xl p-3 shadow-sm">
              {/* Thumbnail */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-pastel-50 flex-shrink-0 flex items-center justify-center text-2xl">
                {thumb ? <img src={imgSrc(thumb)} alt="" className="w-full h-full object-cover" /> : emoji}
              </div>

              {/* Name + price */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-xs md:text-sm truncate">{item.name}</p>
                <p className="text-pastel-500 font-bold text-sm">₹{item.price}</p>
              </div>

              {/* Qty */}
              <div className="flex items-center border border-pastel-200 rounded-full overflow-hidden text-xs md:text-sm">
                <button onClick={() => updateQty(item._id, item.quantity - 1)} className="px-2.5 py-1.5 hover:bg-pastel-50 text-pastel-500">−</button>
                <span className="px-2">{item.quantity}</span>
                <button onClick={() => updateQty(item._id, item.quantity + 1)} className="px-2.5 py-1.5 hover:bg-pastel-50 text-pastel-500">+</button>
              </div>

              {/* Subtotal */}
              <p className="font-semibold text-gray-700 text-sm w-14 text-right">₹{item.price * item.quantity}</p>

              {/* Remove */}
              <button onClick={() => removeFromCart(item._id)} className="text-gray-300 hover:text-red-400 transition text-sm ml-1">✕</button>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-pastel-50 rounded-2xl p-5 border border-pastel-100">
        <div className="flex justify-between text-base md:text-lg font-bold text-gray-800 mb-4">
          <span>Total</span>
          <span className="text-pastel-500">₹{total}</span>
        </div>
        <button onClick={handleCheckout}
          className="w-full bg-pastel-400 text-white py-3 rounded-full font-medium hover:bg-pastel-500 transition text-sm md:text-base">
          Proceed to Checkout
        </button>
        <Link to="/shop" className="block text-center text-pastel-400 text-sm mt-3 hover:underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

