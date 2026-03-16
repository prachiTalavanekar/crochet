const router = require('express').Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// STATS
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const [totalOrders, totalUsers, totalProducts, allOrders, todayOrders] = await Promise.all([
      Order.countDocuments(), User.countDocuments(), Product.countDocuments(),
      Order.find(), Order.find({ createdAt: { $gte: today } })
    ]);
    const totalRevenue = allOrders.reduce((s, o) => s + o.totalPrice, 0);
    const todayRevenue = todayOrders.reduce((s, o) => s + o.totalPrice, 0);
    const pendingOrders = allOrders.filter(o => o.orderStatus === 'Processing').length;
    const productSales = {};
    allOrders.forEach(o => o.items.forEach(i => {
      productSales[i.name] = (productSales[i.name] || 0) + i.quantity;
    }));
    const topProducts = Object.entries(productSales).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,sold])=>({name,sold}));
    res.json({ totalOrders, totalUsers, totalProducts, totalRevenue, pendingOrders, todayOrders: todayOrders.length, todayRevenue, topProducts });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ORDERS
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    res.json(await Order.find().populate('user','name email').sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/orders/:id', protect, adminOnly, async (req, res) => {
  try {
    res.json(await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true }).populate('user','name email'));
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.delete('/orders/:id', protect, adminOnly, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// USERS
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const withOrders = await Promise.all(users.map(async u => {
      const orderCount = await Order.countDocuments({ user: u._id });
      return { ...u.toObject(), orderCount };
    }));
    res.json(withOrders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password'));
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PRODUCTS
router.post('/products', protect, adminOnly, async (req, res) => {
  try {
    res.status(201).json(await Product.create(req.body));
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/products/:id', protect, adminOnly, async (req, res) => {
  try {
    res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.delete('/products/:id', protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// TRANSACTIONS
router.get('/transactions', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('user','name email').sort({ createdAt: -1 });
    const transactions = orders.map((o, i) => ({
      txnId: `TXN${1000 + i}`,
      orderId: o._id.toString().slice(-6).toUpperCase(),
      orderRef: o._id,
      customer: o.user?.name || 'Unknown',
      email: o.user?.email || '',
      amount: o.totalPrice,
      method: o.paymentMethod,
      status: o.paymentStatus === 'paid' ? 'Success' : 'Pending',
      date: o.createdAt
    }));
    res.json(transactions);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// INVENTORY
router.get('/inventory', protect, adminOnly, async (req, res) => {
  try {
    res.json(await Product.find().sort({ stock: 1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/inventory/:id', protect, adminOnly, async (req, res) => {
  try {
    res.json(await Product.findByIdAndUpdate(req.params.id, { stock: req.body.stock }, { new: true }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
