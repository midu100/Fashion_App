const productSchema = require('../models/productSchema')
const orderSchema = require('../models/orderSchema')
const { runAgent } = require('../utils/agentService')

const LOW_STOCK_THRESHOLD = 10

// ====== Ask the agent (stub for now — see utils/agentService.js)
const query = async (req, res) => {
  try {
    const { prompt } = req.body
    if (!prompt) return res.status(400).send({ message: 'Prompt is required' })

    const [products, orders] = await Promise.all([
      productSchema.countDocuments({}),
      orderSchema.countDocuments({}),
    ])

    const result = await runAgent({ prompt, context: { products, orders } })
    res.status(200).send({ message: 'Agent responded.', result })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== Store suggestions (rule-based; low stock via per-variant sum)
const getSuggestions = async (req, res) => {
  try {
    const lowStock = await productSchema.aggregate([
      { $project: { title: 1, totalStock: { $sum: '$variants.stock' } } },
      { $match: { totalStock: { $lte: LOW_STOCK_THRESHOLD } } },
      { $limit: 20 },
    ])

    const suggestions = lowStock.map((p) => ({
      type: 'inventory',
      severity: p.totalStock <= 0 ? 'high' : 'medium',
      message:
        p.totalStock <= 0
          ? `${p.title} is out of stock — restock soon.`
          : `${p.title} is running low (${p.totalStock} left).`,
      productId: p._id,
    }))

    res.status(200).send({ message: 'Suggestions generated.', suggestions })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

module.exports = { query, getSuggestions }
