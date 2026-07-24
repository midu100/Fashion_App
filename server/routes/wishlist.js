const express = require('express')
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController')
const { authMiddleware } = require('../middleware/authMiddleware')

const route = express.Router()

route.get('/', authMiddleware, getWishlist)
route.post('/toggle', authMiddleware, toggleWishlist)

module.exports = route
