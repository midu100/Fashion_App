const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// ====== 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000)

// ====== Access token (1h)
const generateAccToken = (user) =>
  jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SEC, { expiresIn: '1h' })

// ====== Refresh token (15d)
const generateRefreshToken = (user) =>
  jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SEC, { expiresIn: '15d' })

// ====== Verify
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SEC)
  } catch (err) {
    return null
  }
}

// ====== Reset token (raw + hashed)
const generateResetToken = () => {
  const resetToken = crypto.randomBytes(16).toString('hex')
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  return { resetToken, hashedToken }
}

const hashResetToken = (token) => crypto.createHash('sha256').update(token).digest('hex')

// ====== Slugify a title  → "LGS Reversible Bomber" => "lgs-reversible-bomber"
const slugify = (text = '') =>
  text.toString().toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

module.exports = {
  generateOTP,
  generateAccToken,
  generateRefreshToken,
  verifyToken,
  generateResetToken,
  hashResetToken,
  slugify,
}
