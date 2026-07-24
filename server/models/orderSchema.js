const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    // Optional — set when a logged-in user places the order (guest checkout allowed)
    user: { type: mongoose.Types.ObjectId, ref: 'user', default: null },
    items: [
      {
        product: { type: mongoose.Types.ObjectId, ref: 'product' },
        name: { type: String },
        image: { type: String },
        price: { type: Number },
        size: { type: String },
        sku: { type: String }, // exact variant sold — used to restore stock on cancel
        qty: { type: Number, default: 1 },
      },
    ],
    shippingAddress: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      zip: { type: String },
      country: { type: String },
    },
    paymentMethod: { type: String, enum: ['card', 'cod'], default: 'card' },
    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('order', orderSchema)
