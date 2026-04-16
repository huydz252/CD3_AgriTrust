const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controller/auth/authController');

// profile
router.get('/profile', authController.isLoggedIn, (req, res) => {
    res.render('user/profile'); 
});
router.get('/cart', authController.isLoggedIn, (req, res) =>{
    res.render('user/cart', {cartItems : [] });
})

module.exports = router