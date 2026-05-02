const express = require('express')
const router = express.Router()
const passport = require('passport');
const authController = require('../controller/auth/authController');
const ownerController = require('../controller/owner/ownerController')

router.get('/myProducts', authController.isOwner, ownerController.getMyProducts);

module.exports = router;