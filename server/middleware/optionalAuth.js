const { verifyToken } = require('../utils/helpers')
const { getToken } = require('./authMiddleware')

// ====== Optional auth — links the order to a user IF logged in, but never blocks guests
const optionalAuth = (req, res, next) => {
  try {
    const token = getToken(req)
    if (token) {
      const decoded = verifyToken(token)
      if (decoded) req.user = decoded
    }
  } catch (error) {
    console.log(error)
  }
  next()
}

module.exports = { optionalAuth }
