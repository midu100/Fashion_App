const { verifyToken } = require('../utils/helpers')

// ====== Optional auth — links the order to a user IF logged in, but never blocks guests
const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies?.['X_AS-TOKEN']
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
