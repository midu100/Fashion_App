const analytics = require('./analytics')

// ====== Read-only business-intelligence tools for the AI assistant ======
// Neutral schema (name/description/parameters as JSON Schema). Each provider
// adapter converts this into its own tool format. Every number the assistant
// reports MUST come from one of these — they run real Mongo aggregations.

const dateProps = {
  from: { type: 'string', description: 'Start date ISO YYYY-MM-DD (optional; omit for all-time).' },
  to: { type: 'string', description: 'End date ISO YYYY-MM-DD (optional; omit for up to now).' },
}

const tools = [
  {
    name: 'get_sales_summary',
    description: 'Realised revenue, order count, average order value, units sold, plus pending revenue, for a date range. Use for "how much did I sell/earn" questions.',
    parameters: { type: 'object', properties: { ...dateProps }, additionalProperties: false },
  },
  {
    name: 'get_profit_and_loss',
    description: 'Total realised profit/loss = sold revenue − cost of goods (buy price), with margin %, for a date range. Use for any profit/loss/margin question.',
    parameters: { type: 'object', properties: { ...dateProps }, additionalProperties: false },
  },
  {
    name: 'get_profit_by_product',
    description: 'Per-product profit breakdown (revenue, cost, profit, units, margin %) sorted by profit, for a date range. Use to find best/worst performers.',
    parameters: { type: 'object', properties: { ...dateProps, limit: { type: 'number', description: 'Max rows (default 20).' } }, additionalProperties: false },
  },
  {
    name: 'get_loss_makers',
    description: 'Products sold at or below cost (negative profit) in a date range. Use for "which products lose money".',
    parameters: { type: 'object', properties: { ...dateProps }, additionalProperties: false },
  },
  {
    name: 'get_inventory_status',
    description: 'Stock health: total products, in/low/out-of-stock counts, capital tied up in stock, and the low-stock list. Use for inventory/stock questions.',
    parameters: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_dead_stock',
    description: 'In-stock products with ZERO sales in the last N days and the capital tied up in them. Use for "dead stock / not selling".',
    parameters: { type: 'object', properties: { days: { type: 'number', description: 'Look-back window in days (default 30).' } }, additionalProperties: false },
  },
  {
    name: 'get_restock_suggestions',
    description: 'Velocity-based restock recommendations: products likely to run out soon, with a suggested reorder quantity. Use for "what should I restock".',
    parameters: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_top_products',
    description: 'Top selling products by units and revenue (realised) for a date range.',
    parameters: { type: 'object', properties: { ...dateProps, limit: { type: 'number', description: 'Max rows (default 5).' } }, additionalProperties: false },
  },
  {
    name: 'get_customer_stats',
    description: 'Registered-customer stats: total customers, average lifetime value, active buyers, and top customers by spend. (Guest orders are excluded.)',
    parameters: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_order_stats',
    description: 'Order distribution by status, plus stuck orders (paid/processing too long) and unfulfilled count. Use for order/fulfilment questions.',
    parameters: { type: 'object', properties: {}, additionalProperties: false },
  },
]

// ====== Dispatcher: tool name → analytics function. Never throws.
const executeTool = async (name, input = {}) => {
  try {
    switch (name) {
      case 'get_sales_summary': return await analytics.getSalesSummary(input)
      case 'get_profit_and_loss': return await analytics.getProfitAndLoss(input)
      case 'get_profit_by_product': return await analytics.getProfitByProduct(input)
      case 'get_loss_makers': return { lossMakers: await analytics.getLossMakers(input) }
      case 'get_inventory_status': return await analytics.getInventoryStatus()
      case 'get_dead_stock': return await analytics.getDeadStock(input)
      case 'get_restock_suggestions': return await analytics.getRestockSuggestions(input)
      case 'get_top_products': return { topProducts: await analytics.getTopProducts(input) }
      case 'get_customer_stats': return (await analytics.getCustomerStats()).stats
      case 'get_order_stats': return await analytics.getOrderStats(input)
      default: return { error: `Unknown tool: ${name}` }
    }
  } catch (error) {
    console.log('Tool error:', name, error?.message || error)
    return { error: `Tool "${name}" failed: ${error?.message || 'unknown error'}` }
  }
}

module.exports = { tools, executeTool }
