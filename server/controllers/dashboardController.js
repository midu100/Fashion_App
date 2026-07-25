const orderSchema = require('../models/orderSchema')
const userSchema = require('../models/userSchema')
const productSchema = require('../models/productSchema')
const subscriberSchema = require('../models/subscriberSchema')
const settingsSchema = require('../models/settingsSchema')
const analytics = require('../utils/analytics')

// ====== Dashboard overview (admin) — composed from the shared analytics core
const getOverview = async (req, res) => {
  try {
    const [sales, pl, inv, orderStats, custom, topProducts, recentOrders, totalOrders] = await Promise.all([
      analytics.getSalesSummary({}),
      analytics.getProfitAndLoss({}),
      analytics.getInventoryStatus(),
      analytics.getOrderStats({}),
      analytics.getCustomerStats(),
      analytics.getTopProducts({ limit: 5 }),
      orderSchema.find().sort({ createdAt: -1 }).limit(5),
      orderSchema.countDocuments({}),
    ])

    res.status(200).send({
      message: 'Success',
      overview: {
        kpis: {
          totalRevenue: sales.realizedRevenue,
          totalOrders,
          avgOrderValue: sales.avgOrderValue,
          totalCustomers: custom.stats.totalCustomers,
          deliveredCount: sales.orders,
          pendingOrders: sales.pendingOrders,
        },
        finance: {
          soldRevenue: pl.soldRevenue,
          soldCost: pl.soldCost,
          totalProfit: pl.grossProfit,
          inventoryCapital: inv.inventoryCapital,
          pendingRevenue: sales.pendingRevenue,
          pendingOrders: sales.pendingOrders,
        },
        inventory: {
          totalProducts: inv.totalProducts,
          inStock: inv.inStock,
          lowStock: inv.lowStock,
          outOfStock: inv.outOfStock,
        },
        ordersByStatus: orderStats.ordersByStatus,
        recentOrders,
        topSelling: topProducts.map((p) => ({ _id: p.productId, name: p.name, image: p.image, sold: p.sold, revenue: p.revenue })),
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== Analytics (admin) — 14-day revenue series + category breakdown (realised only)
const getAnalytics = async (req, res) => {
  try {
    const DAYS = 14
    const now = new Date()
    const start = new Date(now)
    start.setDate(start.getDate() - (DAYS - 1))
    start.setHours(0, 0, 0, 0)

    // Realised revenue per day (zero-filled window) — payment-aware, consistent with KPIs
    const revAgg = await orderSchema.aggregate([
      { $match: { $and: [analytics.REALIZED_MATCH, { createdAt: { $gte: start } }] } },
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

    // Sales by category — realised only
    const salesByCategory = await orderSchema.aggregate([
      { $match: analytics.REALIZED_MATCH },
      { $unwind: '$items' },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'categories', localField: 'product.category', foreignField: '_id', as: 'category' } },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $group: { _id: { $ifNull: ['$category.name', 'Other'] }, value: { $sum: { $multiply: ['$items.price', '$items.qty'] } }, units: { $sum: '$items.qty' } } },
      { $sort: { value: -1 } },
    ])

    res.status(200).send({ message: 'Success', analytics: { revenue: { labels, revenueSeries, ordersSeries }, salesByCategory } })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== Customers (admin) — delegated to the analytics core
const getCustomers = async (req, res) => {
  try {
    const { customers, stats } = await analytics.getCustomerStats()
    res.status(200).send({ message: 'Success', customers, stats })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== Marketing (admin) — subscribers, most-wishlisted, new customers
const getMarketing = async (req, res) => {
  try {
    const since = new Date()
    since.setDate(since.getDate() - 30)

    const [totalSubscribers, recentSubscribers, newCustomers, totalCustomers] = await Promise.all([
      subscriberSchema.countDocuments({}),
      subscriberSchema.find().sort({ createdAt: -1 }).limit(10),
      userSchema.countDocuments({ role: 'user', createdAt: { $gte: since } }),
      userSchema.countDocuments({ role: 'user' }),
    ])

    // Most-wishlisted products (from users' wishlist arrays)
    const mostWishlisted = await userSchema.aggregate([
      { $unwind: '$wishlist' },
      { $group: { _id: '$wishlist', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, productId: '$_id', name: '$product.title', thumbnail: '$product.thumbnail', wishlistedBy: '$count' } },
    ])

    res.status(200).send({
      message: 'Success',
      marketing: {
        stats: { totalSubscribers, newCustomers, totalCustomers, wishlistItems: mostWishlisted.length },
        recentSubscribers,
        mostWishlisted,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== Reports (admin) — generic { columns, rows } for CSV export
const getReport = async (req, res) => {
  try {
    const { type } = req.params
    let columns = []
    let rows = []

    if (type === 'sales') {
      const orders = await orderSchema.aggregate([{ $match: analytics.REALIZED_MATCH }, { $sort: { createdAt: -1 } }])
      columns = ['Order', 'Date', 'Customer', 'Items', 'Total', 'Status']
      rows = orders.map((o) => [o.orderNumber, new Date(o.createdAt).toISOString().slice(0, 10), o.shippingAddress?.firstName || 'Guest', o.items?.length || 0, o.total, o.status])
    } else if (type === 'inventory') {
      const products = await productSchema.aggregate([
        { $addFields: { totalStock: { $sum: '$variants.stock' } } },
        { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'cat' } },
        { $unwind: { path: '$cat', preserveNullAndEmptyArrays: true } },
      ])
      columns = ['Product', 'Category', 'Stock', 'Sell Price', 'Buy Price', 'Active']
      rows = products.map((p) => [p.title, p.cat?.name || '—', p.totalStock, p.price, p.buyPrice || 0, p.isActive ? 'Yes' : 'No'])
    } else if (type === 'customers') {
      const { customers } = await analytics.getCustomerStats()
      columns = ['Name', 'Email', 'Orders', 'Total Spent', 'Joined']
      rows = customers.map((c) => [c.fullName || '', c.email, c.orders, c.spent || 0, new Date(c.createdAt).toISOString().slice(0, 10)])
    } else if (type === 'financial') {
      const pl = await analytics.getProfitAndLoss({})
      const sales = await analytics.getSalesSummary({})
      const inv = await analytics.getInventoryStatus()
      columns = ['Metric', 'Value']
      rows = [
        ['Realised Revenue', sales.realizedRevenue],
        ['Cost of Goods', pl.soldCost],
        ['Gross Profit', pl.grossProfit],
        ['Margin %', pl.marginPct],
        ['Pending Revenue', sales.pendingRevenue],
        ['Inventory Capital', inv.inventoryCapital],
      ]
    } else if (type === 'products') {
      const rowsData = await analytics.getProfitByProduct({ limit: 500 })
      columns = ['Product', 'Units', 'Revenue', 'Cost', 'Profit', 'Margin %']
      rows = rowsData.map((p) => [p.name, p.units, p.revenue, p.cost, p.profit, p.marginPct])
    } else {
      return res.status(400).send({ message: 'Unknown report type' })
    }

    res.status(200).send({ message: 'Success', report: { type, columns, rows, generatedAt: new Date().toISOString() } })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== Store settings (admin) — singleton get/update
const getSettings = async (req, res) => {
  try {
    let settings = await settingsSchema.findOne()
    if (!settings) settings = await settingsSchema.create({})
    res.status(200).send({ message: 'Success', settings })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

const updateSettings = async (req, res) => {
  try {
    const allowed = ['storeName', 'supportEmail', 'currency', 'country', 'lowStockThreshold', 'freeShippingThreshold', 'shippingFee']
    const update = {}
    for (const k of allowed) if (req.body[k] !== undefined) update[k] = req.body[k]
    const settings = await settingsSchema.findOneAndUpdate({}, update, { new: true, upsert: true })
    res.status(200).send({ message: 'Settings saved', settings })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

module.exports = { getOverview, getAnalytics, getCustomers, getMarketing, getReport, getSettings, updateSettings }
