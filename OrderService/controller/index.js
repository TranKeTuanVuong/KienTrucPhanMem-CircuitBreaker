// controllers/product.controller.js
const Order = require('../models/index');

// Tạo đơn hàng
exports.createOrder = async (req, res) => {
  const { orderId, products, totalAmount } = req.body;
  const order = new Order({ orderId, products, totalAmount });
  await order.save();
  res.status(201).json(order);
};

// Lấy tất cả đơn
exports.getOrders = async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
};

// Lấy đơn theo ID
exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  res.json(order);
};

// Huỷ đơn hàng
exports.cancelOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
  res.json(order);
};

