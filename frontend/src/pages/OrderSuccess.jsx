import { useLocation, Link } from 'react-router-dom';

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="max-w-lg mx-auto px-4 py-12 md:py-16 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Thank you for your order!</h1>
      <p className="text-gray-400 mb-8 text-sm">Your crochet items will be shipped soon 🧶</p>

      {order && (
        <div className="bg-pastel-50 border border-pastel-100 rounded-2xl p-5 text-left space-y-3">
          <p className="text-sm text-gray-500">
            Order ID: <span className="font-semibold text-gray-700">#{order._id?.slice(-6).toUpperCase()}</span>
          </p>
          <div className="space-y-1">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate mr-2">{item.name} ×{item.quantity}</span>
                <span className="flex-shrink-0">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-pastel-200 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-pastel-500">₹{order.totalPrice}</span>
          </div>
          <p className="text-xs text-gray-400">
            📍 {order.shipping?.address}, {order.shipping?.city}, {order.shipping?.state}
          </p>
          <p className="text-xs">
            Payment:{' '}
            <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-orange-400'}`}>
              {order.paymentStatus === 'paid' ? 'Paid Online' : 'Cash on Delivery'}
            </span>
          </p>
        </div>
      )}

      <div className="flex gap-3 mt-8 justify-center">
        <Link to="/orders" className="border border-pastel-300 text-pastel-500 px-5 py-2.5 rounded-full text-sm hover:bg-pastel-50 transition">
          My Orders
        </Link>
        <Link to="/shop" className="bg-pastel-400 text-white px-5 py-2.5 rounded-full text-sm hover:bg-pastel-500 transition">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
