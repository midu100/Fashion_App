const orderSchema = require('../models/orderSchema')
const productSchema = require('../models/productSchema')
const userSchema = require('../models/userSchema')

const LOW_STOCK_THRESHOLD = 10

// ====== Dashboard overview (admin) — live aggregates from the DB
const getOverview = async (req, res) => {
  try {
    // ---- Products / inventory (stock lives per-variant → sum it)
    const totalProducts = await productSchema.countDocuments({})
    const stockAgg = await productSchema.aggregate([{ $project: { totalStock: { $sum: '$variants.stock' } } }])
    let inStock = 0
    let lowStock = 0
    let outOfStock = 0
    for (const p of stockAgg) {
      if (p.totalStock <= 0) outOfStock++
      else if (p.totalStock <= LOW_STOCK_THRESHOLD) lowStock++
      else inStock++
    }

    // ---- Customers
    const totalCustomers = await userSchema.countDocuments({ role: 'user' })

    // ---- Orders
    // Revenue/profit are recognised only on REALISED sales (delivered).
    // Everything in-flight (pending/paid/processing/shipped) sits in pendingRevenue.
    const REALIZED = ['delivered']
    const PENDING = ['pending', 'paid', 'processing', 'shipped']

    const totalOrders = await orderSchema.countDocuments({})
    const deliveredCount = await orderSchema.countDocuments({ status: { $in: REALIZED } })

    const revenueAgg = await orderSchema.aggregate([
      { $match: { status: { $in: REALIZED } } },
      { $group: { _id: null, revenue: { $sum: '$total' } } },
    ])
    const totalRevenue = revenueAgg[0]?.revenue || 0
    const avgOrderValue = deliveredCount > 0 ? totalRevenue / deliveredCount : 0

    const pendingAgg = await orderSchema.aggregate([
      { $match: { status: { $in: PENDING } } },
      { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
    ])
    const pendingRevenue = pendingAgg[0]?.revenue || 0
    const pendingOrders = pendingAgg[0]?.count || 0

    // ---- Profit / loss (sold price − buy price) — REALISED sales only
    const profitAgg = await orderSchema.aggregate([
      { $match: { status: { $in: REALIZED } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          soldRevenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
          soldCost: { $sum: { $multiply: [{ $ifNull: ['$product.buyPrice', 0] }, '$items.qty'] } },
        },
      },
    ])
    const soldRevenue = profitAgg[0]?.soldRevenue || 0
    const soldCost = profitAgg[0]?.soldCost || 0
    const totalProfit = soldRevenue - soldCost

    // ---- Inventory capital tied up in stock (stock × buyPrice)
    const capitalAgg = await productSchema.aggregate([
      { $unwind: { path: '$variants', preserveNullAndEmptyArrays: true } },
      { $group: { _id: null, capital: { $sum: { $multiply: [{ $ifNull: ['$buyPrice', 0] }, { $ifNull: ['$variants.stock', 0] }] } } } },
    ])
    const inventoryCapital = capitalAgg[0]?.capital || 0

    const statusAgg = await orderSchema.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    const ordersByStatus = statusAgg.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {})

    const recentOrders = await orderSchema.find().sort({ createdAt: -1 }).limit(5)

    // ---- Top selling (from realised sales)
    const topSelling = await orderSchema.aggregate([
      { $match: { status: { $in: REALIZED } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          image: { $first: '$items.image' },
          sold: { $sum: '$items.qty' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
    ])

    res.status(200).send({
      message: 'Success',
      overview: {
        kpis: { totalRevenue, totalOrders, avgOrderValue, totalCustomers, deliveredCount, pendingOrders },
        finance: { soldRevenue, soldCost, totalProfit, inventoryCapital, pendingRevenue, pendingOrders },
        inventory: { totalProducts, inStock, lowStock, outOfStock },
        ordersByStatus,
        recentOrders,
        topSelling,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== Analytics (admin) — time series + category breakdown for charts
const getAnalytics = async (req, res) => {
  try {
    const DAYS = 14
    const now = new Date()
    const start = new Date(now)
    start.setDate(start.getDate() - (DAYS - 1))
    start.setHours(0, 0, 0, 0)

    // ---- Revenue per day (zero-filled window)
    const revAgg = await orderSchema.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
    ])
    const revMap = revAgg.reduce((acc, r) => ({ ...acc, [r._id]: r }), {})

    const labels = []
    const revenueSeries = []
    const ordersSeries = []
    for (let i = 0; i < DAYS; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      revenueSeries.push(revMap[key]?.revenue || 0)
      ordersSeries.push(revMap[key]?.orders || 0)
    }

    // ---- Sales by category (from sold line items)
    const salesByCategory = await orderSchema.aggregate([
      { $unwind: '$items' },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'categories', localField: 'product.category', foreignField: '_id', as: 'category' } },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $group: { _id: { $ifNull: ['$category.name', 'Other'] }, value: { $sum: { $multiply: ['$items.price', '$items.qty'] } }, units: { $sum: '$items.qty' } } },
      { $sort: { value: -1 } },
    ])

    res.status(200).send({
      message: 'Success',
      analytics: {
        revenue: { labels, revenueSeries, ordersSeries },
        salesByCategory,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== Customers (admin) — users + order count + total spent
const getCustomers = async (req, res) => {
  try {
    const customers = await userSchema.aggregate([
      { $match: { role: 'user' } },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders',
        },
      },
      {
        $project: {
          fullName: 1,
          email: 1,
          avatar: 1,
          createdAt: 1,
          isVerified: 1,
          orders: { $size: '$orders' },
          spent: { $sum: '$orders.total' },
        },
      },
      { $sort: { spent: -1 } },
    ])

    const totalCustomers = customers.length
    const totalSpent = customers.reduce((s, c) => s + (c.spent || 0), 0)
    const avgLtv = totalCustomers ? totalSpent / totalCustomers : 0

    res.status(200).send({
      message: 'Success',
      customers,
      stats: { totalCustomers, avgLtv, activeBuyers: customers.filter((c) => c.orders > 0).length },
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

module.exports = { getOverview, getAnalytics, getCustomers }
