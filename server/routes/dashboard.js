const express = require('express')
const {
  getOverview,
  getAnalytics,
  getCustomers,
  getMarketing,
  getReport,
  getSettings,
  updateSettings,
} = require('../controllers/dashboardController')
const { authMiddleware } = require('../middleware/authMiddleware')
const roleCheck = require('../middleware/roleCheckMiddleware')

const route = express.Router()

// ====== Admin dashboard
route.get('/overview', authMiddleware, roleCheck('admin'), getOverview)
route.get('/analytics', authMiddleware, roleCheck('admin'), getAnalytics)
route.get('/customers', authMiddleware, roleCheck('admin'), getCustomers)
route.get('/marketing', authMiddleware, roleCheck('admin'), getMarketing)
route.get('/report/:type', authMiddleware, roleCheck('admin'), getReport)
route.get('/settings', authMiddleware, roleCheck('admin'), getSettings)
route.put('/settings', authMiddleware, roleCheck('admin'), updateSettings)

module.exports = route
