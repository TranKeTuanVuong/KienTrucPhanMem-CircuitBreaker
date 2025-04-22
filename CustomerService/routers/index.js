const express = require('express');
const router = express.Router();
const controller = require('../controller/index');

router.post('/createCustomer', controller.createCustomer);
router.get('/', controller.getCustomers);
router.get('/getByID', controller.getCustomerById);
router.put('/updateByID', controller.updateCustomer);
router.delete('/deleteByID', controller.deleteCustomer);

module.exports = router;
