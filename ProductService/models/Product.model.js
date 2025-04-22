const mongoose = require('mongoose');

// Định nghĩa Schema cho sản phẩm
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  stock: { type: Number, default: 0 },
  category: { type: String },
});

// Tạo model từ schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
