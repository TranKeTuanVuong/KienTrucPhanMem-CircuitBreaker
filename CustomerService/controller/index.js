const Customer = require('../models/index');

// Tạo khách hàng mới
exports.createCustomer = async (req, res) => {
  const { customerId, name, email, phone, address } = req.body;
  const customer = new Customer({ customerId, name, email, phone, address });
  await customer.save();
  res.status(201).json(customer);
};

// Lấy danh sách
exports.getCustomers = async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
};

// Chi tiết
exports.getCustomerById = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
  res.json(customer);
};

// Cập nhật
exports.updateCustomer = async (req, res) => {
  const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// Xoá
exports.deleteCustomer = async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.status(204).send();
};
