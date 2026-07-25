const gemini = require('./gemini')
// Future paid drop-in: const anthropic = require('./anthropic')

// ====== Provider dispatcher ======
// Swap the AI provider with the AI_PROVIDER env var. Returns null when the
// selected provider has no API key configured (caller degrades gracefully).
const getProvider = () => {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase()

  if (provider === 'gemini') {
    return process.env.GEMINI_API_KEY ? gemini : null
  }

  // ====== Future paid providers (drop in an adapter + set AI_PROVIDER) ======
  // if (provider === 'anthropic') return process.env.ANTHROPIC_API_KEY ? anthropic : null

  return null
}

module.exports = { getProvider }
