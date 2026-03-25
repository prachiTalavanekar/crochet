import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const items = cart.map(i => ({ product: i._id, name: i.name, price: i.price, quantity: i.quantity }));
      const { data } = await api.post('/api/orders',
        { items, shipping: form, totalPrice: total, paymentMethod },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      clearCart();
      navigate('/order-success', { state: { order: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
      setLoading(false);
    }
  };

  const inp = (key, placeholder, type = 'text') => (
    <input type={type} placeholder={placeholder} required
      className="w-full border border-pastel-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pastel-400"
      value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      <form onSubmit={handleOrder} className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8">

        {/* Shipping */}
        <div className="bg-white border border-pastel-100 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-700 mb-4 text-sm md:text-base">📍 Shipping Details</h2>
          <div className="space-y-3">
            {inp('name', 'Full Name')}
            {inp('phone', 'Phone Number', 'tel')}
            {inp('address', 'Full Address')}
            <div className="grid grid-cols-2 gap-3">
              {inp('city', 'City')}
              {inp('state', 'State')}
            </div>
            {inp('pincode', 'Pincode')}
          </div>

          <h2 className="font-semibold text-gray-700 mt-5 mb-3 text-sm md:text-base">💳 Payment Method</h2>
          <div className="grid grid-cols-2 gap-3">
            {['cod', 'online'].map(m => (
              <button type="button" key={m} onClick={() => setPaymentMethod(m)}
                className={`py-3 rounded-xl text-sm font-medium border transition ${
                  paymentMethod === m ? 'bg-pastel-400 text-white border-pastel-400' : 'bg-white text-gray-600 border-pastel-200'
                }`}>
                {m === 'cod' ? '💵 Cash on Delivery' : '💳 Online'}
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-pastel-50 border border-pastel-100 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-700 mb-4 text-sm md:text-base">🛍️ Order Summary</h2>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">{item.name} ×{item.quantity}</span>
                  <span className="font-medium flex-shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-pastel-200 mt-3 pt-3 flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span className="text-pastel-500">₹{total}</span>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mt-3 bg-red-50 p-3 rounded-xl">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full mt-4 bg-pastel-400 text-white py-3.5 rounded-full font-semibold hover:bg-pastel-500 transition disabled:opacity-60 text-sm md:text-base">
            {loading ? 'Placing Order...' : '✓ Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}


