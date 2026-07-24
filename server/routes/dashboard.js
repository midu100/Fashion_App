const express = require('express')
const { getOverview, getAnalytics, getCustomers } = require('../controllers/dashboardController')
const { authMiddleware } = require('../middleware/authMiddleware')
const roleCheck = require('../middleware/roleCheckMiddleware')

const route = express.Router()

// ====== Admin dashboard
route.get('/overview', authMiddleware, roleCheck('admin'), getOverview)
route.get('/analytics', authMiddleware, roleCheck('admin'), getAnalytics)
route.get('/customers', authMiddleware, roleCheck('admin'), getCustomers)

module.exports = route
