import React, { useState, useEffect, useRef } from 'react'
import { FiSend, FiCpu, FiAlertTriangle, FiTrendingUp, FiBox, FiShoppingBag } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { agentServices } from '../../api'
import PageHeader from '../../components/admin/PageHeader'
import Panel from '../../components/admin/Panel'

const sevColor = { high: '#f87171', medium: '#C9A96E', low: '#4ade80' }
const catIcon = { inventory: FiBox, financial: FiTrendingUp, orders: FiShoppingBag }

const SUGGESTED = [
  'What is my profit this month?',
  'Which products are losing money?',
  'What should I restock?',
  'Top selling products this month',
]

const Agents = () => {
  // ====== Chat state
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me anything about your store — profit, sales, inventory, customers. I read your real data to answer.' },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)

  // ====== Insights state
  const [insights, setInsights] = useState([])
  const [loadingInsights, setLoadingInsights] = useState(true)

  useEffect(() => {
    agentServices
      .getInsights()
      .then((res) => setInsights(res?.insights || []))
      .catch((err) => console.log(err))
      .finally(() => setLoadingInsights(false))
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  // ====== Send a prompt to the AI
  const send = async (text) => {
    const prompt = (text ?? input).trim()
    if (!prompt || sending) return
    const next = [...messages, { role: 'user', content: prompt }]
    setMessages(next)
    setInput('')
    try {
      setSending(true)
      const res = await agentServices.query({
        prompt,
        history: next.slice(-8).map((m) => ({ role: m.role, content: m.content })),
      })
      setMessages((prev) => [...prev, { role: 'assistant', content: res?.reply || '…', toolsUsed: res?.toolsUsed }])
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message || 'AI request failed', { position: 'top-center' })
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry — I could not answer that right now.' }])
    } finally {
      setSending(false)
    }
  }

  const grouped = insights.reduce((acc, i) => ({ ...acc, [i.category]: [...(acc[i.category] || []), i] }), {})

  return (
    <div className="space-y-6">
      <PageHeader title="AI Assistant" subtitle="Ask about your business in plain language — answers come from your real data." />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ====== Chat ====== */}
        <Panel className="xl:col-span-2" title="Ask the Assistant">
          <div ref={scrollRef} className="h-[420px] overflow-y-auto space-y-4 pr-1 mb-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${m.role === 'user' ? 'order-2' : ''}`}>
                  <div
                    className={`px-4 py-3 rounded-[14px] text-[13.5px] font-body leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-primary text-dark rounded-br-[4px]'
                        : 'bg-dark-card border border-dark-border text-cream rounded-bl-[4px]'
                    }`}
                  >
                    {m.content}
                  </div>
                  {m.toolsUsed?.length > 0 && (
                    <p className="text-[10px] font-ui text-cream-muted/50 mt-1 px-1">data: {[...new Set(m.toolsUsed)].join(', ')}</p>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-dark-card border border-dark-border text-cream-muted px-4 py-3 rounded-[14px] rounded-bl-[4px] text-[13px] font-body animate-pulse">
                  Analyzing your data…
                </div>
              </div>
            )}
          </div>

          {/* Suggested prompts */}
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={sending}
                className="text-[11px] font-body text-cream-muted border border-dark-border rounded-full px-3 py-1.5 hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={(e) => { e.preventDefault(); send() }} className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about profit, sales, stock…"
              className="flex-1 bg-dark-card border border-dark-border text-cream placeholder:text-cream-muted/40 px-4 py-3 text-[13px] font-body rounded-[10px] outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="w-12 h-12 shrink-0 rounded-[10px] bg-primary text-dark flex items-center justify-center hover:bg-primary-light transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <FiSend size={18} />
            </button>
          </form>
        </Panel>

        {/* ====== Insights ====== */}
        <Panel title="AI Insights" subtitle="Automated alerts from your data">
          {loadingInsights ? (
            <p className="text-[13px] font-body text-cream-muted py-6 text-center animate-pulse">Scanning…</p>
          ) : insights.length === 0 ? (
            <p className="text-[13px] font-body text-cream-muted py-6 text-center">All good — no alerts right now.</p>
          ) : (
            <div className="space-y-5 max-h-[520px] overflow-y-auto pr-1">
              {Object.entries(grouped).map(([cat, items]) => {
                const Icon = catIcon[cat] || FiAlertTriangle
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={14} className="text-primary" />
                      <span className="text-[11px] font-ui tracking-wide text-cream-muted uppercase">{cat}</span>
                    </div>
                    <div className="space-y-2">
                      {items.map((it, i) => (
                        <div key={i} className="flex items-start gap-2.5 bg-dark-card border border-dark-border rounded-[10px] px-3 py-2.5">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: sevColor[it.severity] }} />
                          <p className="text-[12.5px] font-body text-cream leading-snug">{it.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Panel>
      </div>

      {/* ====== Capability note ====== */}
      <div className="bg-dark-secondary border border-dark-border rounded-[16px] p-5 flex items-start gap-3">
        <span className="w-10 h-10 rounded-[12px] bg-primary/15 text-primary flex items-center justify-center shrink-0"><FiCpu size={20} /></span>
        <div>
          <p className="text-[13px] font-ui text-cream font-semibold">Grounded in your real data</p>
          <p className="text-[12px] font-body text-cream-muted mt-1 leading-relaxed">
            The assistant computes every number from live sales, orders, products and customers — it never guesses.
            Revenue &amp; profit count realised sales only (card = paid; COD = cash collected). Advisory only — it never changes your data.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Agents
