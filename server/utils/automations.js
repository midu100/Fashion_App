const analytics = require('./analytics')
const { runAgent } = require('./agentService')
const { sendEmail } = require('./emailServices')
const { digestTemp } = require('./templates')

// ====== Automations engine — rule-based, categorized advisory insights ======
// Deterministic (no AI key needed). Powers the dashboard + Agents page and
// feeds the (optional) AI digest. Each insight: { category, severity, message, meta }.

const money = (n) => `$${Number(n || 0).toLocaleString('en-US')}`

const getInsights = async () => {
  const insights = []

  // ---- Inventory
  const inv = await analytics.getInventoryStatus()
  if (inv.outOfStock > 0)
    insights.push({ category: 'inventory', severity: 'high', message: `${inv.outOfStock} product(s) are out of stock.`, meta: { count: inv.outOfStock } })
  if (inv.lowStock > 0)
    insights.push({ category: 'inventory', severity: 'medium', message: `${inv.lowStock} product(s) are low on stock (≤10 left).`, meta: { items: inv.lowStockList.slice(0, 8) } })

  const dead = await analytics.getDeadStock({ days: 30 })
  if (dead.count > 0)
    insights.push({ category: 'inventory', severity: 'medium', message: `${dead.count} product(s) had no sales in 30 days — ${money(dead.capitalTiedUp)} of capital tied up.`, meta: { products: dead.products.slice(0, 8) } })

  const restock = await analytics.getRestockSuggestions({})
  if (restock.count > 0)
    insights.push({ category: 'inventory', severity: 'medium', message: `${restock.count} product(s) will likely run out soon — consider restocking.`, meta: { suggestions: restock.suggestions.slice(0, 8) } })

  // ---- Financial
  const pl = await analytics.getProfitAndLoss({})
  insights.push({
    category: 'financial',
    severity: pl.grossProfit >= 0 ? 'low' : 'high',
    message:
      pl.grossProfit >= 0
        ? `All-time realised profit is ${money(pl.grossProfit)} (margin ${pl.marginPct}%).`
        : `You are running at a LOSS of ${money(Math.abs(pl.grossProfit))} on realised sales.`,
    meta: pl,
  })

  const losers = await analytics.getLossMakers({})
  if (losers.length > 0)
    insights.push({ category: 'financial', severity: 'high', message: `${losers.length} product(s) are sold at or below cost (losing money).`, meta: { products: losers.slice(0, 8) } })

  const sales = await analytics.getSalesSummary({})
  if (sales.pendingRevenue > 0)
    insights.push({ category: 'financial', severity: 'medium', message: `${money(sales.pendingRevenue)} across ${sales.pendingOrders} order(s) is pending — cash not yet collected.`, meta: { pendingRevenue: sales.pendingRevenue, pendingOrders: sales.pendingOrders } })

  // ---- Orders
  const orderStats = await analytics.getOrderStats({})
  if (orderStats.stuckOrders > 0)
    insights.push({ category: 'orders', severity: 'high', message: `${orderStats.stuckOrders} order(s) have been stuck in paid/processing for 3+ days.`, meta: { count: orderStats.stuckOrders } })
  if (orderStats.unfulfilled > 0)
    insights.push({ category: 'orders', severity: 'low', message: `${orderStats.unfulfilled} order(s) are unfulfilled.`, meta: { count: orderStats.unfulfilled } })

  return insights
}

// ====== AI business digest (emailed) ======
// Uses the AI assistant when a provider key is set; otherwise falls back to a
// plain rule-based summary from getInsights(). Emails via the existing sendEmail.
const DIGEST_PROMPT =
  'Write a concise daily business digest for the shop owner. Cover: realised sales & profit so far this month, ' +
  'the top-selling product, any inventory alerts (out/low/dead stock, restock needs), pending (uncollected) revenue, ' +
  'and any orders needing attention. Use short one-line bullets. Call whatever tools you need.'

const generateDigest = async () => {
  const to = process.env.AGENT_DIGEST_TO
  if (!to) return { sent: false, reason: 'AGENT_DIGEST_TO not set' }

  // Prefer an AI-written digest; fall back to rule-based insight lines
  let body
  const res = await runAgent({ prompt: DIGEST_PROMPT })
  if (res?.reply && !res.degraded) {
    body = res.reply
  } else {
    const insights = await getInsights()
    body = insights.length ? insights.map((i) => `• [${i.category}] ${i.message}`).join('\n') : 'No alerts today — all good.'
  }

  await sendEmail({ email: to, template: digestTemp, subject: 'KAZIR NATION — Business Digest', item: body })
  return { sent: true, to, aiGenerated: !res.degraded }
}

module.exports = { getInsights, generateDigest }
