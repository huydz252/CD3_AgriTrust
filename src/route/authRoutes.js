const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controller/auth/authController');

router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'],
    // prompt: 'select_account' 
}));

// Route xử lý callback từ Google
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    authController.googleCallback
);

router.get('/logout', authController.logout);



module.exports = router;