import React from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi'
import { icons } from './adminIcons'

// ====== Split a formatted value ("$250,450.00", "48.1%", "340 products") into
// prefix + number + suffix so we can animate just the number. Returns null for
// non-numeric values ("Allowed", "KNITWEAR") → rendered as-is.
const parseValue = (val) => {
  const str = String(val ?? '')
  const match = str.match(/-?[\d,]*\.?\d+/)
  if (!match) return null
  const numStr = match[0]
  const clean = numStr.replace(/,/g, '')
  return {
    num: parseFloat(clean),
    prefix: str.slice(0, match.index),
    suffix: str.slice(match.index + numStr.length),
    decimals: clean.includes('.') ? clean.split('.')[1].length : 0,
  }
}

// ====== KPI card (value + % change + icon) ======
const StatCard = ({ stat, index = 0 }) => {
  const Icon = icons[stat.icon]
  const parsed = parseValue(stat.value)
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
      <p className="text-[1.9rem] font-body font-semibold text-cream leading-none mb-3">
        {parsed ? (
          <CountUp
            end={parsed.num}
            duration={1.6}
            separator=","
            decimals={parsed.decimals}
            prefix={parsed.prefix}
            suffix={parsed.suffix}
            enableScrollSpy
            scrollSpyOnce
          />
        ) : (
          stat.value
        )}
      </p>
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
