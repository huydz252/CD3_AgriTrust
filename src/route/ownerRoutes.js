const express = require('express')
const router = express.Router()
const passport = require('passport');
const authController = require('../controller/auth/authController');
const ownerController = require('../controller/owner/ownerController')

router.get('/myProducts', authController.isOwner, ownerController.getMyProducts);
router.post('/myProducts/updateProduct', authController.isOwner, ownerController.updateProductInfo);
router.get('/myOrders', authController.isOwner, ownerController.getMyOrders);
router.get('/myOrders/updateStatus', authController.isOwner, ownerController.updateStatus);



module.exports = router;