import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const STATUS_COLOR = {
  Processing: 'bg-yellow-100 text-yellow-600',
  Packed: 'bg-blue-100 text-blue-600',
  Shipped: 'bg-purple-100 text-purple-600',
  Delivered: 'bg-green-100 text-green-600',
  Cancelled: 'bg-red-100 text-red-500',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/api/orders/myorders', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => { setOrders(Array.isArray(res.data) ? res.data : []); setLoading(false); });
  }, []);

  if (loading) return <p className="text-center py-20 text-gray-400 text-sm">Loading orders...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-5 md:mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-gray-400 text-sm">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white border border-pastel-100 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs font-semibold text-gray-700">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLOR[order.orderStatus] || 'bg-gray-100 text-gray-500'}`}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">{item.name} ×{item.quantity}</span>
                    <span className="text-gray-700 flex-shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-pastel-100 pt-3">
                <span className={`text-xs font-medium ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-orange-400'}`}>
                  {order.paymentStatus === 'paid' ? '✓ Paid' : '💵 Cash on Delivery'}
                </span>
                <span className="font-bold text-pastel-500">₹{order.totalPrice}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


