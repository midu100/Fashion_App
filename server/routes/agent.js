const express = require('express')
const { query, getSuggestions } = require('../controllers/agentController')
const { authMiddleware } = require('../middleware/authMiddleware')
const roleCheck = require('../middleware/roleCheckMiddleware')

const route = express.Router()

// ====== AI Agent (admin) — scaffold, ready to be powered by a model
route.post('/query', authMiddleware, roleCheck('admin'), query)
route.get('/suggestions', authMiddleware, roleCheck('admin'), getSuggestions)

module.exports = route
