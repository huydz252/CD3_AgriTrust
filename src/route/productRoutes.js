const express = require('express')
const router = express.Router()
const productController = require('../controller/productController')

router.get('/', productController.getProjectName)
router.get('/info', productController.getProjectName)
router.get('/products', productController.getAllProducts)
router.post('/createProduct', productController.createProduct);
router.get('/history/:id', productController.getProductHistory);



module.exports = router;