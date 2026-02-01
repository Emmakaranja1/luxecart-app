const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');

router.get('/', productsController.getAll);
router.get('/featured', productsController.getFeatured);
router.get('/:id', productsController.getById);
router.get('/slug/:slug', productsController.getBySlug);

module.exports = router;
