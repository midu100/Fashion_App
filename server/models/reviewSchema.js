const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Types.ObjectId, ref: 'product', required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
)

// One review per user per product (they can update it)
reviewSchema.index({ product: 1, user: 1 }, { unique: true })

module.exports = mongoose.model('review', reviewSchema)
