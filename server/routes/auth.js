const express = require('express')
const multer = require('multer')
const {
  signUp,
  verifyOTP,
  resendOTP,
  signIn,
  forgotPass,
  ressetPassword,
  getUserProfile,
  updateUserProfile,
  refreshToken,
  logout,
} = require('../controllers/authController')
const { authMiddleware } = require('../middleware/authMiddleware')

const route = express.Router()
const upload = multer()

// ====== Public
route.post('/signup', signUp)
route.post('/verify-otp', verifyOTP)
route.post('/resend-otp', resendOTP)
route.post('/signin', signIn)
route.post('/forgot-password', forgotPass)
route.put('/reset-password/:token', ressetPassword)
route.get('/refresh', refreshToken)

// ====== Protected
route.get('/me', authMiddleware, getUserProfile)
route.put('/profile', authMiddleware, upload.single('avatar'), updateUserProfile)
route.post('/logout', authMiddleware, logout)

module.exports = route
