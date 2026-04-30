const express = require('express')
const router = express.Router()
const productController = require('../controller/product/productController')

const multer = require('multer');
const upload = multer();

router.get('/', productController.getAllProducts)
router.get('/products', productController.getAllProducts)
router.post('/createProduct', upload.none(), productController.createProduct);
router.get('/history/:id', productController.getProductHistory);
router.post('/sync-status', productController.syncStatusWithMySQL);

module.exports = router;