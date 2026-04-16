const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controller/auth/authController');

// profile
router.get('/profile', authController.isLoggedIn, (req, res) => {
    res.render('user/profile'); 
});

module.exports = router