// ====== Gemini provider adapter (free tier) ======
// Implements the tool-calling loop natively for Google's @google/genai SDK.
// Neutral tools ({name, description, parameters}) → functionDeclarations.

const DEFAULT_MODEL = 'gemini-flash-latest'

// Neutral JSON-schema → Gemini schema (uppercase types, drop unsupported keys)
const toGeminiSchema = (params) => {
  const props = {}
  for (const [key, val] of Object.entries(params?.properties || {})) {
    props[key] = { type: String(val.type || 'string').toUpperCase(), description: val.description }
  }
  return Object.keys(props).length ? { type: 'OBJECT', properties: props } : null
}

const buildDeclarations = (tools) =>
  tools.map((t) => {
    const decl = { name: t.name, description: t.description }
    const schema = toGeminiSchema(t.parameters)
    if (schema) decl.parameters = schema
    return decl
  })

const runConversation = async ({ system, prompt, history = [], tools, executeTool, model, maxIterations = 8 }) => {
  const { GoogleGenAI } = require('@google/genai')
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  const mdl = model || process.env.AGENT_MODEL || DEFAULT_MODEL
  const functionDeclarations = buildDeclarations(tools)

  const contents = []
  for (const h of history.slice(-8)) {
    contents.push({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: String(h.content || '') }] })
  }
  contents.push({ role: 'user', parts: [{ text: prompt }] })

  const toolsUsed = []
  try {
    for (let i = 0; i < maxIterations; i++) {
      const res = await ai.models.generateContent({
        model: mdl,
        contents,
        config: { systemInstruction: system, tools: [{ functionDeclarations }] },
      })

      const calls = res.functionCalls || []
      if (!calls.length) {
        return { reply: res.text || 'I could not produce an answer.', toolsUsed }
      }

      // Preserve the model's function-call turn, then answer each call
      if (res.candidates?.[0]?.content) contents.push(res.candidates[0].content)
      const parts = []
      for (const call of calls) {
        toolsUsed.push(call.name)
        const result = await executeTool(call.name, call.args || {})
        parts.push({ functionResponse: { name: call.name, response: result } })
      }
      contents.push({ role: 'user', parts })
    }
    return { reply: 'I gathered a lot of data but could not finish — please narrow the question.', toolsUsed }
  } catch (error) {
    console.log('Gemini error:', error?.message || error)
    return { reply: 'The AI service is unavailable right now. Please try again in a moment.', toolsUsed, error: true }
  }
}

module.exports = { runConversation }
