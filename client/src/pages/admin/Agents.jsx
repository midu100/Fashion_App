import React, { useState, useEffect } from 'react'
import { FiSettings, FiAlertTriangle } from 'react-icons/fi'
import { agents } from '../../data/adminData'
import { icons } from '../../components/admin/adminIcons'
import { agentServices } from '../../api'
import PageHeader from '../../components/admin/PageHeader'
import StatusBadge from '../../components/admin/StatusBadge'
import Panel from '../../components/admin/Panel'
import AgentAssistant from '../../components/admin/AgentAssistant'

const sevColor = { high: '#f87171', medium: '#C9A96E', low: '#60a5fa' }

const Agents = () => {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  // ====== Real rule-based suggestions (low-stock) from the agent endpoint
  useEffect(() => {
    agentServices
      .getSuggestions()
      .then((res) => setSuggestions(res?.suggestions || []))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Agents"
        subtitle="Autonomous helpers for inventory, finance and operations."
      />

      {/* Assistant card */}
      <AgentAssistant
        message={`I scanned your catalog — ${suggestions.length} inventory alert${suggestions.length !== 1 ? 's' : ''} need attention.`}
        onViewSuggestions={() => {}}
      />

      {/* Live suggestions (real endpoint) */}
      <Panel title="Live Inventory Suggestions" subtitle="Rule-based now — ready to be powered by an AI model">
        {loading ? (
          <p className="text-[13px] font-body text-cream-muted py-6 text-center animate-pulse">Scanning…</p>
        ) : suggestions.length === 0 ? (
          <p className="text-[13px] font-body text-cream-muted py-6 text-center">All good — no low-stock items right now.</p>
        ) : (
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-center gap-3 bg-dark-card border border-dark-border rounded-[12px] px-4 py-3">
                <span className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0" style={{ background: `${sevColor[s.severity]}1a`, color: sevColor[s.severity] }}>
                  <FiAlertTriangle size={15} />
                </span>
                <p className="flex-1 text-[13px] font-body text-cream">{s.message}</p>
                <span className="text-[10px] font-ui uppercase tracking-wide font-bold" style={{ color: sevColor[s.severity] }}>{s.severity}</span>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* Agent grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {agents.map((a) => {
          const Icon = icons[a.icon]
          return (
            <div key={a.name} className="bg-dark-secondary border border-dark-border rounded-[18px] p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <span
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
                  style={{ background: `${a.accent}1a`, color: a.accent }}
                >
                  {Icon && <Icon size={22} />}
                </span>
                <StatusBadge status={a.status} />
              </div>
              <h3 className="text-[15px] font-ui tracking-wide text-cream font-semibold">{a.name}</h3>
              <p className="text-[12.5px] font-body text-cream-muted mt-1.5 leading-relaxed">{a.role}</p>
              <div className="flex items-center gap-3 mt-5">
                <button className="flex-1 py-2.5 bg-dark-card border border-dark-border rounded-[10px] text-[12px] font-ui tracking-wide text-cream hover:border-primary hover:text-primary transition-colors cursor-pointer">
                  {a.status === 'Active' ? 'Manage' : 'Activate'}
                </button>
                <button className="w-10 h-10 rounded-[10px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-primary hover:border-primary transition-colors cursor-pointer">
                  <FiSettings size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-[12px] font-body text-cream-muted/60 text-center pt-2">
        Agents are scaffolded and ready — connect an AI provider to bring them online.
      </p>
    </div>
  )
}

export default Agents
