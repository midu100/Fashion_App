const subscriberSchema = require('../models/subscriberSchema')
const { isValidEmail } = require('../utils/regexValidation')

// ====== Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const { email } = req.body
    if (!isValidEmail(email)) return res.status(400).send({ message: 'Invalid email address' })

    const isExist = await subscriberSchema.findOne({ email })
    if (isExist) return res.status(400).send({ message: 'You are already subscribed' })

    await subscriberSchema.create({ email })
    res.status(201).send({ message: 'Thank you for subscribing!' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

module.exports = { subscribe }
