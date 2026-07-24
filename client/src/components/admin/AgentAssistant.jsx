import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiChevronRight } from 'react-icons/fi'

// ====== AI Agent Assistant card ======
// STATIC for now. When wiring the agent later:
//   - call POST /agent/query on the backend (see server/routes/agent.js)
//   - stream/insert the response where `message` is rendered
//   - "View Suggestions" → open a panel of agent actions (inventory, finance, etc.)
const AgentAssistant = ({ message, onViewSuggestions }) => {
  return (
    <div className="bg-dark-secondary border border-dark-border rounded-[18px] p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <h3 className="text-[15px] font-ui tracking-wide text-cream font-semibold">AI Agent Assistant</h3>
        <button className="inline-flex items-center gap-1 text-[11px] font-ui text-cream-muted hover:text-primary transition-colors cursor-pointer">
          View All
          <FiChevronRight size={13} />
        </button>
      </div>

      <div className="flex items-start gap-4 relative z-10">
        {/* Glowing orb */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-primary via-primary-dark to-dark flex items-center justify-center shadow-[0_0_30px_-4px_rgba(201,169,110,0.6)]"
        >
          <div className="w-6 h-6 border-2 border-dark/60 rotate-45" />
        </motion.div>

        <div className="flex-1">
          <p className="text-[13px] font-body text-cream leading-relaxed">
            Hi Mridul! <span className="text-primary">👋</span>
            <br />
            {message}
          </p>
          <button
            onClick={onViewSuggestions}
            className="mt-4 inline-flex items-center gap-2 border border-dark-border rounded-[10px] px-4 py-2.5 text-[12px] font-ui tracking-wide text-cream hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            View Suggestions
            <FiArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AgentAssistant
