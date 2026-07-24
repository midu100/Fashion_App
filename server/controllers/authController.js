const userSchema = require('../models/userSchema')
const { uploadToCloudinary, deleteToCloudinary } = require('../utils/cloudinaryService')
const { sendEmail } = require('../utils/emailServices')
const {
  generateOTP,
  generateAccToken,
  generateRefreshToken,
  generateResetToken,
  hashResetToken,
  verifyToken,
} = require('../utils/helpers')
const { isValidEmail, isValidPassword } = require('../utils/regexValidation')
const { emailTemp, resetPassTemp } = require('../utils/templates')

// ====== Sign Up (creates user + OTP; email stub logs the OTP)
const signUp = async (req, res) => {
  try {
    const { fullName, email, password, phone, address, role } = req.body

    if (!email) return res.status(400).send({ message: 'Email is required.' })
    if (!isValidEmail(email)) return res.status(400).send({ message: 'Please enter valid email.' })
    if (!password) return res.status(400).send({ message: 'Password is required.' })
    if (!isValidPassword(password))
      return res.status(400).send({ message: 'Please choose strong password.(Atleast 1 letter & 1 number)' })

    const existUser = await userSchema.findOne({ email })
    if (existUser) return res.status(400).send({ message: 'Email already exists.' })

    const generateOtp = generateOTP()

    const userData = new userSchema({
      fullName,
      email,
      password,
      phone,
      address,
      role,
      otp: generateOtp,
      otpExpire: Date.now() + 2 * 60 * 1000,
    })
    sendEmail({ email, template: emailTemp, subject: 'Email Verification', item: generateOtp })
    userData.save()

    res.status(201).send({ message: 'Registration Success,Please verify your email.' })
  } catch (error) {
    console.log(error)
  }
}

// ====== Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body

    if (!otp) return res.status(400).send({ message: 'OTP is required' })
    if (!email) return res.status(400).send({ message: 'Invalid request' })

    const user = await userSchema.findOne({
      email,
      otp: Number(otp),
      otpExpire: { $gt: new Date() },
    })

    if (!user) return res.status(400).send({ message: 'Invalid or expired OTP' })

    user.isVerified = true
    user.otp = null
    user.save()

    res.status(200).send({ message: 'Verification Successful.' })
  } catch (error) {
    console.log(error)
  }
}

// ====== Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).send({ message: 'Invalid request' })

    const user = await userSchema.findOne({ email, isVerified: false })
    if (!user) return res.status(400).send({ message: 'Invalid request' })

    const generateOtp = generateOTP()
    sendEmail({ email, template: emailTemp, subject: 'Verify your email', item: generateOtp })

    user.otp = generateOtp
    user.otpExpire = Date.now() + 2 * 60 * 1000
    user.save()

    res.status(200).send({ message: 'OTP send' })
  } catch (error) {
    console.log(error)
  }
}

// ====== Sign In (sets access + refresh cookies)
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email) return res.status(400).send({ message: 'Email is required' })
    if (!password) return res.status(400).send({ message: 'Password is required' })

    const existUser = await userSchema.findOne({ email })
    if (!existUser) return res.status(400).send({ message: 'User Not Registered' })
    if (!existUser.isVerified)
      return res.status(400).send({ message: 'Your email is not verify,please verfy your email.' })

    const matchedPass = await existUser.comparePassword(password)
    if (!matchedPass) return res.status(400).send({ message: 'Incorrect password' })

    const accToken = generateAccToken(existUser)
    const refToken = generateRefreshToken(existUser)

    res.cookie('X_AS-TOKEN', accToken)
    res.cookie('R_FS-TOKEN', refToken)
    res.status(200).send({ message: 'Login Successful.', role: existUser.role })
  } catch (error) {
    console.log(error)
  }
}

// ====== Forgot password (email stub logs the reset link)
const forgotPass = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).send({ message: 'Email is required' })
    if (!isValidEmail(email)) return res.status(400).send({ message: 'Enter Valid Email.' })

    const existUser = await userSchema.findOne({ email })
    if (!existUser) return res.status(400).send({ message: 'Email not found' })

    const { hashedToken, resetToken } = generateResetToken()
    existUser.resetPassToken = hashedToken
    existUser.resetExpire = Date.now() + 2 * 60 * 1000
    existUser.save()

    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`
    sendEmail({ email, template: resetPassTemp, subject: 'reset password', item: resetLink })

    res.status(200).send({ message: 'reset pass link in your email.' })
  } catch (error) {
    console.log(error)
  }
}

// ====== Reset password
const ressetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body
    const { token } = req.params
    if (!newPassword) return res.status(400).send({ message: 'New Passowrd is required' })
    if (!token) return res.status(400).send({ message: '404 - not found' })

    const hashToken = hashResetToken(token)
    const existUser = await userSchema.findOne({
      resetPassToken: hashToken,
      resetExpire: { $gt: Date.now() },
    })

    if (!existUser) return res.status(400).send({ message: 'Invalid request' })
    existUser.password = newPassword
    existUser.resetPassToken = undefined
    existUser.resetExpire = undefined
    existUser.save()

    res.status(200).send({ message: 'Password changed successfully.' })
  } catch (error) {
    console.log(error)
  }
}

// ====== Get profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userSchema
      .findById(req.user._id)
      .select('-password -otp -otpExpire -resetPassToken -resetExpire -updatedAt')
    if (!user) return res.status(400).send({ message: 'Invalid request' })

    res.status(200).send({ message: 'Successful', user })
  } catch (error) {
    console.log(error)
  }
}

// ====== Update profile (avatar upload)
const updateUserProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body
    const userId = req.user._id
    const avatar = req.file

    const user = await userSchema
      .findById(userId)
      .select('-password -otp -otpExpire -resetPassToken -resetExpire -updatedAt')

    if (avatar) {
      const imgRes = await uploadToCloudinary(avatar, 'avatar')
      if (user.avatar) deleteToCloudinary(user.avatar, 'avatar') // remove the old one only if it exists
      user.avatar = imgRes.secure_url
    }

    if (fullName) user.fullName = fullName
    if (phone) user.phone = phone
    if (address) user.address = address

    await user.save()

    res.status(201).send({ message: 'Update successful', user })
  } catch (error) {
    console.log(error)
  }
}

// ====== Refresh access token
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies['R_FS-TOKEN']
    if (!refreshToken) return res.status(400).send({ message: 'Refresh token missing' })

    const decoded = verifyToken(refreshToken)
    if (!decoded) return res.status(400).json({ message: 'missing verify' })

    const accToken = generateAccToken(decoded)
    res.cookie('X_AS-TOKEN', accToken, { httpOnly: false, secure: false })

    res.status(200).send({ message: 'Successful', accToken })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ====== Logout
const logout = async (req, res) => {
  try {
    res.clearCookie('X_AS-TOKEN')
    res.clearCookie('R_FS-TOKEN')
    res.status(200).send({ message: 'Logged out successfully' })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
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
}
