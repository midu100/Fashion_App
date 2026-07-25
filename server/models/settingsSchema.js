const mongoose = require('mongoose')

// ====== Store settings (singleton document) ======
const settingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'KAZIR NATION' },
    supportEmail: { type: String, default: '' },
    currency: { type: String, default: 'USD ($)' },
    country: { type: String, default: 'Bangladesh' },
    lowStockThreshold: { type: Number, default: 10 },
    freeShippingThreshold: { type: Number, default: 300 },
    shippingFee: { type: Number, default: 25 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('settings', settingsSchema)
