const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { auth, adminAuth } = require('../middleware/auth');

router.use(auth, adminAuth);

router.get('/stats', adminController.getDashboardStats);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id', adminController.updateOrderStatus);
router.get('/payments', adminController.getAllPayments);
router.patch('/payments/:id', adminController.updatePaymentStatus);

module.exports = router;
