const express = require('express')
const { createReview, getProductReviews } = require('../controllers/reviewController')
const { authMiddleware } = require('../middleware/authMiddleware')

const route = express.Router()

route.post('/create', authMiddleware, createReview)
route.get('/:productId', getProductReviews)

module.exports = route
