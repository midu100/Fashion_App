const express = require('express')
const { query, getSuggestions, getInsights, sendDigest } = require('../controllers/agentController')
const { authMiddleware } = require('../middleware/authMiddleware')
const roleCheck = require('../middleware/roleCheckMiddleware')

const route = express.Router()

// ====== AI Agent (admin)
route.post('/query', authMiddleware, roleCheck('admin'), query)
route.get('/suggestions', authMiddleware, roleCheck('admin'), getSuggestions)
route.get('/insights', authMiddleware, roleCheck('admin'), getInsights)
route.post('/digest', authMiddleware, roleCheck('admin'), sendDigest)

module.exports = route
