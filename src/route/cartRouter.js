const express = require('express')
const router = express.Router()
const cartController = require('../controller/cart/cartController')

router.post('/add', cartController.addToCart)

module.exports = router