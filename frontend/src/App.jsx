import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminInventory from './pages/admin/AdminInventory';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.isAdmin ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Store routes */}
      <Route path="/" element={<><Navbar /><Home /></>} />
      <Route path="/shop" element={<><Navbar /><Shop /></>} />
      <Route path="/product/:id" element={<><Navbar /><ProductDetail /></>} />
      <Route path="/cart" element={<><Navbar /><Cart /></>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkout" element={<PrivateRoute><Navbar /><Checkout /></PrivateRoute>} />
      <Route path="/order-success" element={<PrivateRoute><Navbar /><OrderSuccess /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><Navbar /><MyOrders /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Navbar /><Profile /></PrivateRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="inventory" element={<AdminInventory />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}




