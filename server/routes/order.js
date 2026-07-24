const express = require('express')
const {
  placeOrder,
  getMyOrders,
  getOrderByNumber,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController')
const { authMiddleware } = require('../middleware/authMiddleware')
const { optionalAuth } = require('../middleware/optionalAuth')
const roleCheck = require('../middleware/roleCheckMiddleware')

const route = express.Router()

// ====== Public (guest checkout + order tracking)
// optionalAuth links the order to the account when the shopper is signed in.
route.post('/place', optionalAuth, placeOrder)
route.get('/track/:orderNumber', getOrderByNumber)

// ====== Protected (customer)
route.get('/my', authMiddleware, getMyOrders)

// ====== Admin (dashboard)
route.get('/all', authMiddleware, roleCheck('admin'), getAllOrders)
route.put('/:id/status', authMiddleware, roleCheck('admin'), updateOrderStatus)

module.exports = route
