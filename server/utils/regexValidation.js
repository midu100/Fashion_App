// ====== Email
const isValidEmail = (email = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// ====== Password — at least 1 letter & 1 number, min 6
const isValidPassword = (password = '') => /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)

module.exports = { isValidEmail, isValidPassword }
