// ====== AI Agent service (SCAFFOLD — not wired to a model yet) ======
// This is the single place the AI logic will live. When ready to implement:
//   1. npm i @anthropic-ai/sdk
//   2. add ANTHROPIC_API_KEY to .env
//   3. replace runAgent()'s body with a Claude Messages call, passing `context`
//      (store stats, inventory, finances) and exposing tools for actions.
//   Recommended model: 'claude-opus-4-8' (deep analysis) or 'claude-sonnet-5' (fast/cheap).
//
// Intended capabilities: inventory management, financial analysis, order insights.

const runAgent = async ({ prompt, context = {} }) => {
  // --- FUTURE (example shape) -------------------------------------------------
  // const Anthropic = require('@anthropic-ai/sdk')
  // const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  // const res = await client.messages.create({
  //   model: 'claude-opus-4-8',
  //   max_tokens: 1024,
  //   system: 'You are the KAZIR NATION store operations agent...',
  //   messages: [{ role: 'user', content: `${prompt}\n\nStore context: ${JSON.stringify(context)}` }],
  // })
  // return { reply: res.content[0].text, actions: [] }
  // ---------------------------------------------------------------------------

  return {
    reply: `Agent (stub): received "${prompt}". Add ANTHROPIC_API_KEY and wire agentService.runAgent to enable live analysis.`,
    actions: [],
    context,
  }
}

module.exports = { runAgent }
