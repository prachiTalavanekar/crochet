const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['bouquets', 'keychains', 'flowers'],
    required: true
  },
  image: { type: String, default: '' },
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  handmade: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
