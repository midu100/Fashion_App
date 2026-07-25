const orderSchema = require('../models/orderSchema')
const productSchema = require('../models/productSchema')
const couponSchema = require('../models/couponSchema')
const { evaluateCoupon } = require('./couponController')
const { sendEmail } = require('../utils/emailServices')
const { orderConfirmTemp } = require('../utils/templates')

const SHIPPING_THRESHOLD = 300
const SHIPPING_FEE = 25

// ====== Place Order (guest ok) — validates stock, recomputes totals, decrements stock
const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body

    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).send({ message: 'Your cart is empty' })
    if (!shippingAddress?.email || !shippingAddress?.firstName || !shippingAddress?.address)
      return res.status(400).send({ message: 'Shipping details are incomplete' })
    if (!shippingAddress?.phone)
      return res.status(400).send({ message: 'Phone number is required' })

    const lineItems = []
    const stockOps = [] // { productId, sku, qty } — applied only after all checks pass
    let subtotal = 0

    for (const it of items) {
      const productId = it.product || it.id
      if (!productId) return res.status(400).send({ message: 'Invalid product in cart' })

      const dbProduct = await productSchema.findById(productId).catch(() => null)
      if (!dbProduct) return res.status(400).send({ message: 'A product in your cart no longer exists' })
      if (!dbProduct.isActive) return res.status(400).send({ message: `${dbProduct.title} is no longer available` })

      const qty = Math.max(1, Number(it.qty) || 1)

      // Pick the exact variant: match size (+ enough stock); fall back to any in-stock variant
      let variant = null
      if (it.size) variant = dbProduct.variants.find((v) => v.size === it.size && v.stock >= qty)
      if (!variant) variant = dbProduct.variants.find((v) => v.stock >= qty)
      if (!variant) {
        return res.status(400).send({ message: `${dbProduct.title}${it.size ? ` (size ${it.size})` : ''} is out of stock` })
      }

      const price = dbProduct.price
      subtotal += price * qty
      lineItems.push({
        product: dbProduct._id,
        name: dbProduct.title,
        image: dbProduct.thumbnail,
        price,
        size: variant.size,
        sku: variant.sku,
        qty,
      })
      stockOps.push({ productId: dbProduct._id, sku: variant.sku, qty })
    }

    let shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE

    // ---- Coupon (re-validated server-side; never trust the client's amount)
    let discount = 0
    let appliedCode = null
    if (couponCode) {
      const result = await evaluateCoupon(couponCode, subtotal)
      if (!result.valid) return res.status(400).send({ message: result.message })
      discount = result.discount
      appliedCode = result.coupon.code
      if (result.freeShipping) shipping = 0
    }

    const total = Math.max(0, subtotal - discount + shipping)
    const orderNumber = 'KN-' + Date.now().toString().slice(-8)

    const order = await orderSchema.create({
      orderNumber,
      user: req.user?._id || null,
      items: lineItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
      subtotal,
      shipping,
      discount,
      couponCode: appliedCode,
      total,
      status: 'pending',
    })

    // Count coupon usage once the order is created
    if (appliedCode) await couponSchema.updateOne({ code: appliedCode }, { $inc: { usedCount: 1 } })

    // Reserve stock — decrement the exact variant sold
    for (const op of stockOps) {
      await productSchema.updateOne(
        { _id: op.productId, 'variants.sku': op.sku },
        { $inc: { 'variants.$.stock': -op.qty } }
      )
    }

    // Order confirmation email (fire-and-forget — never block/fail the order on email issues)
    sendEmail({
      email: shippingAddress.email,
      template: orderConfirmTemp,
      subject: `Your KAZIR NATION order ${orderNumber}`,
      item: order,
    }).catch((err) => console.log('Order email failed:', err?.message || err))

    res.status(201).send({ message: 'Order placed successfully.', order })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== My Orders (protected)
const getMyOrders = async (req, res) => {
  try {
    const orders = await orderSchema.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.status(200).send({ message: 'Success', orders })
  } catch (error) {
    console.log(error)
  }
}

// ====== Single order by orderNumber (public tracking)
const getOrderByNumber = async (req, res) => {
  try {
    const order = await orderSchema.findOne({ orderNumber: req.params.orderNumber })
    if (!order) return res.status(404).send({ message: 'Order not found' })
    res.status(200).send({ message: 'Success', order })
  } catch (error) {
    console.log(error)
  }
}

// ====== All Orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderSchema.find().sort({ createdAt: -1 })
    res.status(200).send({ message: 'Success', orders })
  } catch (error) {
    console.log(error)
  }
}

// ====== Update Order Status (admin) — cancelling restores reserved stock
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await orderSchema.findById(req.params.id)
    if (!order) return res.status(404).send({ message: 'Order not found' })

    const previous = order.status
    order.status = status
    await order.save()

    // Restore stock when an order is cancelled (once)
    if (status === 'cancelled' && previous !== 'cancelled') {
      for (const it of order.items) {
        if (it.product && it.sku) {
          await productSchema.updateOne(
            { _id: it.product, 'variants.sku': it.sku },
            { $inc: { 'variants.$.stock': it.qty } }
          )
        }
      }
    }

    // Re-reserve stock if an order is moved out of cancelled back to active
    if (previous === 'cancelled' && status !== 'cancelled') {
      for (const it of order.items) {
        if (it.product && it.sku) {
          await productSchema.updateOne(
            { _id: it.product, 'variants.sku': it.sku },
            { $inc: { 'variants.$.stock': -it.qty } }
          )
        }
      }
    }

    res.status(200).send({ message: 'Order status updated.', order })
  } catch (error) {
    console.log(error)
  }
}

module.exports = { placeOrder, getMyOrders, getOrderByNumber, getAllOrders, updateOrderStatus }
