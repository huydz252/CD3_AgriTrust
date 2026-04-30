const express = require('express')
const router = express.Router()
const passport = require('passport');
const authController = require('../controller/auth/authController');
const adminController = require('../controller/admin/adminController')


router.get('/users', authController.isAdmin, adminController.getAllUser)
router.post('/users/edit/:id', authController.isAdmin, adminController.editUser)
router.post('/users/delete/:id', authController.isAdmin, adminController.deleteUser)

module.exports = router;