const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories');

router.get('/', categoriesController.getAll);
router.get('/:slug', categoriesController.getBySlug);

module.exports = router;
