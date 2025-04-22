const controller = require('../controller/Product.Controller');
const express = require('express');
const router = express.Router();


router.get('/GetALL', controller.getAll);
router.post('/GetByID', controller.getById);
router.post('/create', controller.create);
router.put('/updateByID', controller.update);
router.delete('/removeByID', controller.remove);

module.exports = router;