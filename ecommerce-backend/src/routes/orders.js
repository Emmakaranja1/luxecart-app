const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { auth } = require('../middleware/auth');

router.post('/', auth, ordersController.create);
router.get('/', auth, ordersController.getUserOrders);
router.get('/:id', auth, ordersController.getById);

module.exports = router;
