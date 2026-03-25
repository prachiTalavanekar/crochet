const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const seedAdmin = require('./seedAdmin');

const app = express();

app.use(cors());
app.use(express.json());
// Upload route — images stored on Cloudinary
const upload = require('./middleware/upload');
const { protect, adminOnly } = require('./middleware/auth');
app.post('/api/upload', protect, adminOnly, upload.array('images', 10), (req, res) => {
  const urls = req.files.map(f => f.path); // Cloudinary returns full HTTPS URL in f.path
  res.json({ urls });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/profile', require('./routes/profile'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Start server immediately — don't wait for DB
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

// Connect to MongoDB with retries
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    await seedAdmin();
  } catch (err) {
    console.error('MongoDB connection failed, retrying in 5s...', err.message);
    setTimeout(connectDB, 5000);
  }
};

connectDB();
