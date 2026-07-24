const reviewSchema = require('../models/reviewSchema')
const productSchema = require('../models/productSchema')
const userSchema = require('../models/userSchema')

// ====== Create / update a review (auth) — one per user per product
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body

    if (!productId) return res.status(400).send({ message: 'Product is required' })
    if (!rating || rating < 1 || rating > 5) return res.status(400).send({ message: 'Rating must be 1 to 5' })

    const product = await productSchema.findById(productId)
    if (!product) return res.status(404).send({ message: 'Product not found' })

    const user = await userSchema.findById(req.user._id).select('fullName')

    // upsert — a second review from the same user updates the first
    const existing = await reviewSchema.findOne({ product: productId, user: req.user._id })
    if (existing) {
      existing.rating = rating
      existing.comment = comment || ''
      existing.name = user?.fullName || 'Customer'
      await existing.save()
      return res.status(200).send({ message: 'Review updated', review: existing })
    }

    const review = await reviewSchema.create({
      product: productId,
      user: req.user._id,
      name: user?.fullName || 'Customer',
      rating,
      comment: comment || '',
    })

    res.status(201).send({ message: 'Review added', review })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== Get reviews for a product (public) — list + average + count
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params

    const reviews = await reviewSchema.find({ product: productId }).sort({ createdAt: -1 })
    const count = reviews.length
    const avgRating = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0

    res.status(200).send({ message: 'Success', reviews, count, avgRating: Math.round(avgRating * 10) / 10 })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

module.exports = { createReview, getProductReviews }
