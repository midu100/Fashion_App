const couponSchema = require('../models/couponSchema')

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100

// ====== Shared evaluator — used by /validate and by placeOrder ======
// Returns { valid, discount, freeShipping, coupon, message }.
const evaluateCoupon = async (code, subtotal = 0) => {
  if (!code) return { valid: false, message: 'No coupon code' }
  const coupon = await couponSchema.findOne({ code: String(code).toUpperCase().trim() })
  if (!coupon || !coupon.isActive) return { valid: false, message: 'Invalid coupon code' }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return { valid: false, message: 'This coupon has expired' }
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) return { valid: false, message: 'This coupon has reached its usage limit' }
  if (subtotal < (coupon.minOrder || 0)) return { valid: false, message: `Minimum order of $${coupon.minOrder} required` }

  let discount = 0
  let freeShipping = false
  if (coupon.type === 'percentage') discount = (subtotal * coupon.value) / 100
  else if (coupon.type === 'fixed') discount = Math.min(coupon.value, subtotal)
  else if (coupon.type === 'shipping') freeShipping = true

  return { valid: true, discount: round2(discount), freeShipping, coupon, message: 'Coupon applied' }
}

// ====== Validate a coupon (public, used at checkout before placing)
const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body
    const result = await evaluateCoupon(code, Number(subtotal) || 0)
    if (!result.valid) return res.status(400).send({ message: result.message })
    res.status(200).send({
      message: result.message,
      valid: true,
      code: result.coupon.code,
      type: result.coupon.type,
      value: result.coupon.value,
      discount: result.discount,
      freeShipping: result.freeShipping,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== Admin CRUD
const createCoupon = async (req, res) => {
  try {
    const { code, type, value, minOrder, usageLimit, expiresAt, isActive } = req.body
    if (!code) return res.status(400).send({ message: 'Coupon code is required' })
    const exists = await couponSchema.findOne({ code: code.toUpperCase().trim() })
    if (exists) return res.status(400).send({ message: 'Coupon code already exists' })

    const coupon = await couponSchema.create({
      code: code.toUpperCase().trim(),
      type,
      value: Number(value) || 0,
      minOrder: Number(minOrder) || 0,
      usageLimit: usageLimit === '' || usageLimit == null ? null : Number(usageLimit),
      expiresAt: expiresAt || null,
      isActive: isActive !== undefined ? isActive : true,
    })
    res.status(201).send({ message: 'Coupon created', coupon })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponSchema.find().sort({ createdAt: -1 })
    res.status(200).send({ message: 'Success', coupons })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

const updateCoupon = async (req, res) => {
  try {
    const { code, type, value, minOrder, usageLimit, expiresAt, isActive } = req.body
    const coupon = await couponSchema.findById(req.params.id)
    if (!coupon) return res.status(404).send({ message: 'Coupon not found' })

    if (code) coupon.code = code.toUpperCase().trim()
    if (type) coupon.type = type
    if (value !== undefined) coupon.value = Number(value) || 0
    if (minOrder !== undefined) coupon.minOrder = Number(minOrder) || 0
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit === '' || usageLimit == null ? null : Number(usageLimit)
    if (expiresAt !== undefined) coupon.expiresAt = expiresAt || null
    if (isActive !== undefined) coupon.isActive = isActive

    await coupon.save()
    res.status(200).send({ message: 'Coupon updated', coupon })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await couponSchema.findByIdAndDelete(req.params.id)
    if (!coupon) return res.status(404).send({ message: 'Coupon not found' })
    res.status(200).send({ message: 'Coupon deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

module.exports = { evaluateCoupon, validateCoupon, createCoupon, getAllCoupons, updateCoupon, deleteCoupon }
