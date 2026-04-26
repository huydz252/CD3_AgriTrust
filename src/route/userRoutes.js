const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controller/auth/authController');
const cartController = require('../controller/user/cartController');
const profileController = require('../controller/user/profileController');

router.get('/profile', authController.isLoggedIn, profileController.getProfile);
router.post('/profile/update', authController.isLoggedIn, profileController.updateProfile);
router.post('/update-wallet',authController.isLoggedIn, profileController.updateWallet);
router.get('/remove-wallet',authController.isLoggedIn, profileController.removeWallet);

router.get('/cart', authController.isLoggedIn, cartController.showCart)

router.post('/cart/add', authController.isLoggedIn, cartController.addToCart)
router.post('/cart/update-quantity', authController.isLoggedIn, cartController.updateQuantity)
router.delete('/cart/remove', authController.isLoggedIn, cartController.removeProduct)
router.get('/cart/getOrderCode', authController.isLoggedIn, cartController.getOrderCode)

router.post('/cart/order', authController.isLoggedIn, cartController.order)
router.get('/cart/purchased_product', authController.isLoggedIn, cartController.purchasedProduct)
router.get('/cart/purchased_product/detail/:id', authController.isLoggedIn, cartController.orderDetails)

router.get('/cart/history', authController.isLoggedIn, cartController.getHistory)
router.get('/cart/order_detail/:id', authController.isLoggedIn, cartController.orderDetails)

router.get('/cart/statistics', authController.isLoggedIn, cartController.statistics)



module.exports = router