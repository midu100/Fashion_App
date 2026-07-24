import React from 'react'
import { motion } from 'framer-motion'

const marqueeItems = [
  'NEW SEASON SS/26',
  'FREE WORLDWIDE SHIPPING',
  'CRAFTED IN ITALY',
  'MEMBERS EARLY ACCESS',
  'ARCHIVE EXCLUSIVES',
  'CARBON NEUTRAL DELIVERY',
]

const Marquee = () => {
  // Duplicate the track so the loop is seamless
  const loop = [...marqueeItems, ...marqueeItems]

  return (
    <div className="relative bg-primary text-dark py-4 overflow-hidden border-y border-primary-dark/30">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
      >
        {loop.map((item, i) => (
          <div key={i} className="flex items-center shrink-0">
            <span className="text-[12px] md:text-[13px] font-ui tracking-[0.28em] font-semibold uppercase px-8">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-dark/60" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default Marquee
