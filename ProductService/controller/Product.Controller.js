// controllers/product.controller.js
const Product = require('../models/Product.model');
const controller = require('../controller/Product.Controller');

controller.getAll = async (req, res) => {
  const products = await Product.find();
  console.log(products);
  if (!products) return res.status(404).json({ message: 'Not found' });
  res.json(products);
};

controller.getById = async (req, res) => {
  const product = await Product.findOne({productId:req.body});
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

controller.create = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
};

controller.update = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
};

controller.remove = async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.status(204).send();
};

module.exports = controller;