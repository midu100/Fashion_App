const { runAgent } = require('../utils/agentService')
const analytics = require('../utils/analytics')
const { getInsights, generateDigest } = require('../utils/automations')

// ====== Ask the agent (natural-language BI over real store data)
const query = async (req, res) => {
  try {
    const { prompt, history } = req.body
    if (!prompt) return res.status(400).send({ message: 'Prompt is required' })

    const result = await runAgent({ prompt, history: Array.isArray(history) ? history : [] })
    res.status(200).send({ message: 'Agent responded.', reply: result.reply, toolsUsed: result.toolsUsed || [], degraded: !!result.degraded })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== Rule-based inventory suggestions (low stock) — no AI needed
const getSuggestions = async (req, res) => {
  try {
    const inv = await analytics.getInventoryStatus()
    const suggestions = inv.lowStockList.map((p) => ({
      type: 'inventory',
      severity: p.totalStock <= 0 ? 'high' : 'medium',
      message: p.totalStock <= 0 ? `${p.title} is out of stock — restock soon.` : `${p.title} is running low (${p.totalStock} left).`,
      productId: p.productId,
    }))
    res.status(200).send({ message: 'Suggestions generated.', suggestions })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== Categorized automations/insights (rule-based) — no AI needed
const getInsightsHandler = async (req, res) => {
  try {
    const insights = await getInsights()
    res.status(200).send({ message: 'Success', insights })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== Send the AI business digest now (admin, on-demand)
const sendDigest = async (req, res) => {
  try {
    const result = await generateDigest()
    if (!result.sent) return res.status(400).send({ message: result.reason || 'Could not send digest' })
    res.status(200).send({ message: `Digest sent to ${result.to}`, aiGenerated: result.aiGenerated })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

module.exports = { query, getSuggestions, getInsights: getInsightsHandler, sendDigest }
