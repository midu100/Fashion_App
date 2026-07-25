const { tools, executeTool } = require('./agentTools')
const { getProvider } = require('./llm')

// ====== System prompt — the AI's business context + grounding rules ======
const buildSystemPrompt = () => {
  const today = new Date().toISOString().slice(0, 10)
  return `You are the AI business assistant for KAZIR NATION, a fashion e-commerce store.
You help the shop owner (non-technical) understand sales, profit/loss, inventory and customers.

Today's date is ${today}. Currency is US dollars ($).

CRITICAL RULES:
- You MUST call a tool for EVERY number you report. Never estimate, guess or invent figures.
- If the question implies a time range (e.g. "this month", "last week"), convert it to ISO
  from/to dates relative to today and pass them to the tool. If no range is implied, omit the dates.
- "Revenue/profit" mean REALISED sales only: card orders count once "paid", cash-on-delivery
  orders count only at the final "paid" step. Money not yet collected is "pending" — mention it
  separately when relevant so the owner isn't confused.
- Profit uses each product's CURRENT buy price (there is no per-order cost snapshot), so historical
  profit is an approximation — note this only when precision matters.
- Guest orders aren't linked to a customer, so customer stats cover registered buyers only.

STYLE: Answer concisely and clearly for a shop owner. Lead with the key number, then a short
explanation. Use simple formatting (short lists, $ amounts). You may reply in the language the
owner uses (English or Bangla/Banglish).`
}

// ====== runAgent — natural-language BI over real store data ======
// Delegates the tool-calling loop to the configured provider (free Gemini now,
// paid drop-in later). Degrades gracefully when no provider/key is configured.
const runAgent = async ({ prompt, history = [] }) => {
  if (!prompt || !prompt.trim()) {
    return { reply: 'Please type a question about your store.', toolsUsed: [], degraded: true }
  }

  const provider = getProvider()
  if (!provider) {
    return {
      reply:
        'The AI assistant is not configured yet. Add a GEMINI_API_KEY (free from Google AI Studio) ' +
        'to the server .env and set AI_PROVIDER=gemini to enable live analysis. Meanwhile, the ' +
        'Insights panel and inventory alerts still work.',
      toolsUsed: [],
      degraded: true,
    }
  }

  return provider.runConversation({
    system: buildSystemPrompt(),
    prompt,
    history,
    tools,
    executeTool,
    maxIterations: 8,
  })
}

module.exports = { runAgent }
