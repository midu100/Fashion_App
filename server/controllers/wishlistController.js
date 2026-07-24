const userSchema = require('../models/userSchema')

// ====== Get my wishlist (auth) — returns the populated products
const getWishlist = async (req, res) => {
  try {
    const user = await userSchema.findById(req.user._id).populate('wishlist')
    if (!user) return res.status(400).send({ message: 'Invalid request' })

    // strip buyPrice — storefront must never see cost price
    const products = (user.wishlist || []).map((p) => {
      const obj = p.toObject()
      delete obj.buyPrice
      return obj
    })

    res.status(200).send({ message: 'Success', wishlist: products })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== Toggle a product in/out of my wishlist (auth)
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body
    if (!productId) return res.status(400).send({ message: 'Product is required' })

    const user = await userSchema.findById(req.user._id)
    if (!user) return res.status(400).send({ message: 'Invalid request' })

    const exists = user.wishlist.some((id) => id.toString() === productId)
    if (exists) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId)
    } else {
      user.wishlist.push(productId)
    }
    await user.save()

    res.status(200).send({ message: exists ? 'Removed from wishlist' : 'Added to wishlist', wishlist: user.wishlist, added: !exists })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

module.exports = { getWishlist, toggleWishlist }
