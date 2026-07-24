const express = require('express')
const { subscribe } = require('../controllers/newsletterController')

const route = express.Router()

route.post('/subscribe', subscribe)

module.exports = route
