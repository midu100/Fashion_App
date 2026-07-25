const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percentage', 'fixed', 'shipping'], default: 'percentage' },
    value: { type: Number, default: 0 }, // % for percentage, $ for fixed; ignored for shipping
    minOrder: { type: Number, default: 0 }, // minimum subtotal to qualify
    usageLimit: { type: Number, default: null }, // null = unlimited
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date, default: null }, // null = no expiry
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('coupon', couponSchema)
