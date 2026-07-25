const express = require('express')
const {
  validateCoupon,
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require('../controllers/couponController')
const { authMiddleware } = require('../middleware/authMiddleware')
const roleCheck = require('../middleware/roleCheckMiddleware')

const route = express.Router()

// ====== Public (checkout)
route.post('/validate', validateCoupon)

// ====== Admin CRUD
route.get('/all', authMiddleware, roleCheck('admin'), getAllCoupons)
route.post('/create', authMiddleware, roleCheck('admin'), createCoupon)
route.put('/update/:id', authMiddleware, roleCheck('admin'), updateCoupon)
route.delete('/delete/:id', authMiddleware, roleCheck('admin'), deleteCoupon)

module.exports = route
