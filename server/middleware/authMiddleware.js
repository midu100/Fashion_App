const { verifyToken } = require('../utils/helpers')

// ====== Extract the access token from cookie OR Authorization header ======
// Header support makes auth work cross-origin (separate frontend & API hosts)
// where SameSite cookies may be blocked.
const getToken = (req) => {
  const cookieTok = req.cookies?.['X_AS-TOKEN']
  if (cookieTok) return cookieTok
  const auth = req.headers?.authorization
  if (auth) return auth.startsWith('Bearer ') ? auth.slice(7) : auth
  return null
}

const authMiddleware = async (req, res, next) => {
  try {
    const token = getToken(req)
    if (!token) return res.status(401).send({ message: 'Token missing..' })

    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).send({ message: 'Invalid request.' })

    req.user = decoded
    next()
  } catch (error) {
    console.log(error)
    res.status(401).send({ message: 'Authentication failed' })
  }
}

module.exports = { authMiddleware, getToken }
