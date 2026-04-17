const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controller/auth/authController');
const cartController = require('../controller/user/cartController');
const profileController = require('../controller/user/profileController');

// router.get('/profile', profileController.showCart);
router.get('/cart',authController.isLoggedIn, cartController.showCart)
router.post('/cart/add', cartController.addToCart)
router.post('/cart/update-quantity', cartController.updateQuantity)
router.delete('/cart/remove',authController.isLoggedIn, cartController.removeProduct)

module.exports = router