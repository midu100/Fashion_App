const orderSchema = require('../models/orderSchema')
const productSchema = require('../models/productSchema')
const userSchema = require('../models/userSchema')

// ====== Shared analytics core ======
// Single source of truth for every business metric — reused by the dashboard
// controller, the AI tool layer (agentTools.js) and the automations engine.

const LOW_STOCK_THRESHOLD = 10

// Revenue is REALISED when the money is actually in hand:
//  · card (online) → captured at "paid" and stays realised through delivery
//  · cod           → cash collected only at the final "paid" step
// Anything before that is PENDING. Cancelled is excluded from both.
const REALIZED_MATCH = {
  $or: [
    { paymentMethod: 'card', status: { $in: ['paid', 'processing', 'shipped', 'delivered'] } },
    { paymentMethod: 'cod', status: 'paid' },
  ],
}
const PENDING_MATCH = {
  $or: [
    { paymentMethod: 'card', status: 'pending' },
    { paymentMethod: 'cod', status: { $in: ['pending', 'processing', 'shipped', 'delivered'] } },
  ],
}

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100

// Merge an optional createdAt range into a base match (dates are ISO YYYY-MM-DD)
const dateRangeMatch = (base, from, to) => {
  if (!from && !to) return base
  const createdAt = {}
  if (from) createdAt.$gte = new Date(from)
  if (to) {
    const end = new Date(to)
    end.setHours(23, 59, 59, 999)
    createdAt.$lte = end
  }
  return { $and: [base, { createdAt }] }
}

// ====== Sales summary (realised) for an arbitrary date range
const getSalesSummary = async ({ from, to } = {}) => {
  const realized = dateRangeMatch(REALIZED_MATCH, from, to)
  const pending = dateRangeMatch(PENDING_MATCH, from, to)

  const [rev] = await orderSchema.aggregate([
    { $match: realized },
    { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
  ])
  const [units] = await orderSchema.aggregate([
    { $match: realized },
    { $unwind: '$items' },
    { $group: { _id: null, unitsSold: { $sum: '$items.qty' } } },
  ])
  const [pend] = await orderSchema.aggregate([
    { $match: pending },
    { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
  ])

  const revenue = rev?.revenue || 0
  const orders = rev?.orders || 0
  return {
    from: from || 'all-time',
    to: to || 'now',
    realizedRevenue: round2(revenue),
    orders,
    avgOrderValue: round2(orders ? revenue / orders : 0),
    unitsSold: units?.unitsSold || 0,
    pendingRevenue: round2(pend?.revenue || 0),
    pendingOrders: pend?.count || 0,
  }
}

// ====== Profit & loss (realised): sold price − current buy price
const getProfitAndLoss = async ({ from, to } = {}) => {
  const [pl] = await orderSchema.aggregate([
    { $match: dateRangeMatch(REALIZED_MATCH, from, to) },
    { $unwind: '$items' },
    { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: null,
        soldRevenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
        soldCost: { $sum: { $multiply: [{ $ifNull: ['$product.buyPrice', 0] }, '$items.qty'] } },
      },
    },
  ])
  const soldRevenue = pl?.soldRevenue || 0
  const soldCost = pl?.soldCost || 0
  const grossProfit = soldRevenue - soldCost
  return {
    from: from || 'all-time',
    to: to || 'now',
    soldRevenue: round2(soldRevenue),
    soldCost: round2(soldCost),
    grossProfit: round2(grossProfit),
    marginPct: round2(soldRevenue ? (grossProfit / soldRevenue) * 100 : 0),
    note: 'Profit uses each product\'s CURRENT buyPrice (no cost snapshot per order). Realised sales only.',
  }
}

// ====== Profit broken down per product
const getProfitByProduct = async ({ from, to, limit = 20 } = {}) => {
  const rows = await orderSchema.aggregate([
    { $match: dateRangeMatch(REALIZED_MATCH, from, to) },
    { $unwind: '$items' },
    { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: '$items.product',
        name: { $first: '$items.name' },
        units: { $sum: '$items.qty' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
        cost: { $sum: { $multiply: [{ $ifNull: ['$product.buyPrice', 0] }, '$items.qty'] } },
      },
    },
    { $addFields: { profit: { $subtract: ['$revenue', '$cost'] } } },
    { $sort: { profit: -1 } },
    { $limit: limit },
  ])
  return rows.map((r) => ({
    productId: r._id,
    name: r.name,
    units: r.units,
    revenue: round2(r.revenue),
    cost: round2(r.cost),
    profit: round2(r.profit),
    marginPct: round2(r.revenue ? (r.profit / r.revenue) * 100 : 0),
  }))
}

// ====== Loss-making products (sold at/below cost)
const getLossMakers = async ({ from, to } = {}) => {
  const all = await getProfitByProduct({ from, to, limit: 500 })
  return all.filter((p) => p.profit < 0).sort((a, b) => a.profit - b.profit)
}

// ====== Inventory status: buckets, capital, low-stock list
const getInventoryStatus = async () => {
  const stockAgg = await productSchema.aggregate([
    { $addFields: { totalStock: { $sum: '$variants.stock' } } },
    { $project: { title: 1, totalStock: 1, buyPrice: 1 } },
  ])
  let inStock = 0
  let lowStock = 0
  let outOfStock = 0
  let inventoryCapital = 0
  const lowStockList = []
  for (const p of stockAgg) {
    const s = p.totalStock || 0
    if (s <= 0) outOfStock++
    else if (s <= LOW_STOCK_THRESHOLD) lowStock++
    else inStock++
    inventoryCapital += (p.buyPrice || 0) * s
    if (s <= LOW_STOCK_THRESHOLD) lowStockList.push({ productId: p._id, title: p.title, totalStock: s })
  }
  return {
    totalProducts: stockAgg.length,
    inStock,
    lowStock,
    outOfStock,
    inventoryCapital: round2(inventoryCapital),
    lowStockList: lowStockList.sort((a, b) => a.totalStock - b.totalStock),
  }
}

// ====== Sales velocity (units/day over N days) + days of cover
const getSalesVelocity = async ({ days = 30 } = {}) => {
  const start = new Date()
  start.setDate(start.getDate() - days)
  const sold = await orderSchema.aggregate([
    { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: start } } },
    { $unwind: '$items' },
    { $group: { _id: '$items.product', name: { $first: '$items.name' }, units: { $sum: '$items.qty' } } },
  ])
  const stockMap = {}
  const stockAgg = await productSchema.aggregate([{ $addFields: { totalStock: { $sum: '$variants.stock' } } }, { $project: { totalStock: 1 } }])
  stockAgg.forEach((p) => { stockMap[String(p._id)] = p.totalStock || 0 })

  return sold
    .map((r) => {
      const velocity = r.units / days
      const stock = stockMap[String(r._id)] ?? 0
      return {
        productId: r._id,
        name: r.name,
        unitsSold: r.units,
        dailyVelocity: round2(velocity),
        totalStock: stock,
        daysOfCover: velocity > 0 ? round2(stock / velocity) : null,
      }
    })
    .sort((a, b) => b.dailyVelocity - a.dailyVelocity)
}

// ====== Dead stock: in-stock products with zero sales in N days
const getDeadStock = async ({ days = 30 } = {}) => {
  const start = new Date()
  start.setDate(start.getDate() - days)
  const soldIds = await orderSchema.distinct('items.product', { status: { $ne: 'cancelled' }, createdAt: { $gte: start } })
  const dead = await productSchema.aggregate([
    { $addFields: { totalStock: { $sum: '$variants.stock' } } },
    { $match: { _id: { $nin: soldIds }, totalStock: { $gt: 0 } } },
    { $addFields: { capital: { $multiply: [{ $ifNull: ['$buyPrice', 0] }, '$totalStock'] } } },
    { $project: { title: 1, totalStock: 1, buyPrice: 1, capital: 1 } },
    { $sort: { capital: -1 } },
  ])
  return {
    days,
    count: dead.length,
    capitalTiedUp: round2(dead.reduce((s, d) => s + (d.capital || 0), 0)),
    products: dead.map((d) => ({ productId: d._id, title: d.title, totalStock: d.totalStock, capital: round2(d.capital) })),
  }
}

// ====== Restock suggestions (velocity-driven; falls back to low-stock)
const getRestockSuggestions = async ({ leadDays = 7, coverDays = 14 } = {}) => {
  const velocity = await getSalesVelocity({ days: 30 })
  const suggestions = velocity
    .filter((v) => v.dailyVelocity > 0 && v.totalStock <= v.dailyVelocity * leadDays)
    .map((v) => ({
      productId: v.productId,
      name: v.name,
      totalStock: v.totalStock,
      dailyVelocity: v.dailyVelocity,
      daysOfCover: v.daysOfCover,
      suggestedQty: Math.max(1, Math.ceil(v.dailyVelocity * coverDays - v.totalStock)),
    }))
  return { count: suggestions.length, suggestions }
}

// ====== Top selling products (realised)
const getTopProducts = async ({ from, to, limit = 5 } = {}) => {
  const rows = await orderSchema.aggregate([
    { $match: dateRangeMatch(REALIZED_MATCH, from, to) },
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
    { $limit: limit },
  ])
  return rows.map((r) => ({ productId: r._id, name: r.name, image: r.image, sold: r.sold, revenue: round2(r.revenue) }))
}

// ====== Customer stats (registered users only; guests excluded)
const getCustomerStats = async ({ limit = 10 } = {}) => {
  const customers = await userSchema.aggregate([
    { $match: { role: 'user' } },
    { $lookup: { from: 'orders', localField: '_id', foreignField: 'user', as: 'orders' } },
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
  return {
    customers,
    stats: {
      totalCustomers,
      avgLtv: round2(totalCustomers ? totalSpent / totalCustomers : 0),
      activeBuyers: customers.filter((c) => c.orders > 0).length,
      topCustomers: customers.slice(0, limit).map((c) => ({ name: c.fullName, email: c.email, orders: c.orders, spent: round2(c.spent) })),
    },
  }
}

// ====== Order stats: distribution, stuck & unfulfilled
const getOrderStats = async ({ stuckDays = 3 } = {}) => {
  const statusAgg = await orderSchema.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
  const ordersByStatus = statusAgg.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {})

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - stuckDays)
  const stuck = await orderSchema.countDocuments({ status: { $in: ['paid', 'processing'] }, createdAt: { $lt: cutoff } })
  const unfulfilled = await orderSchema.countDocuments({ status: { $in: ['pending', 'paid', 'processing', 'shipped'] } })

  return { ordersByStatus, stuckOrders: stuck, stuckDays, unfulfilled }
}

module.exports = {
  LOW_STOCK_THRESHOLD,
  REALIZED_MATCH,
  PENDING_MATCH,
  dateRangeMatch,
  round2,
  getSalesSummary,
  getProfitAndLoss,
  getProfitByProduct,
  getLossMakers,
  getInventoryStatus,
  getSalesVelocity,
  getDeadStock,
  getRestockSuggestions,
  getTopProducts,
  getCustomerStats,
  getOrderStats,
}
