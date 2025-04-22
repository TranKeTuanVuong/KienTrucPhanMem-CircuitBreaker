const express = require('express');
const router = express.Router();
const controller = require('../controller/index');

router.post('/createOrder', controller.createOrder);
router.get('/', controller.getOrders);
router.get('/OrderByID', controller.getOrderById);
router.put('/cancelOrder', controller.cancelOrder);

module.exports = router;
