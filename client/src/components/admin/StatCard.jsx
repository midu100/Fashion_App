import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi'
import { icons } from './adminIcons'

// ====== KPI card (value + % change + icon) ======
const StatCard = ({ stat, index = 0 }) => {
  const Icon = icons[stat.icon]
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-dark-secondary border border-dark-border rounded-[18px] p-6 hover:border-primary/40 transition-colors duration-300"
    >
      <div className="flex items-start justify-between mb-5">
        <span className="text-[13px] font-ui tracking-wide text-cream-muted">{stat.label}</span>
        <span className="w-10 h-10 rounded-[10px] border border-dark-border flex items-center justify-center text-primary">
          {Icon && <Icon size={18} />}
        </span>
      </div>
      <p className="text-[1.9rem] font-body font-semibold text-cream leading-none mb-3">{stat.value}</p>
      {stat.change ? (
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-[12px] font-semibold ${
              stat.up ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {stat.up ? <FiArrowUpRight size={14} /> : <FiArrowDownRight size={14} />}
            {stat.change}
          </span>
          {stat.sub && <span className="text-[11px] font-body text-cream-muted/70">{stat.sub}</span>}
        </div>
      ) : (
        stat.sub && <span className="text-[11px] font-body text-cream-muted/70">{stat.sub}</span>
      )}
    </motion.div>
  )
}

export default StatCard
