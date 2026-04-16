const express = require('express')
const router = express.Router()
const productController = require('../controller/product/productController')

router.get('/', productController.getAllProducts)
router.get('/products', productController.getAllProducts)
router.post('/createProduct', productController.createProduct);
router.get('/history/:id', productController.getProductHistory);
router.post('/sync-status', productController.syncStatusWithMySQL);

module.exports = router;