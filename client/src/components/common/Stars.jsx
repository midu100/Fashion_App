import React from 'react'
import { FiStar } from 'react-icons/fi'

// ====== Read-only star rating (supports halves via fill width) ======
const Stars = ({ value = 0, size = 16, className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1))) // 0..1 for this star
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <FiStar size={size} className="absolute inset-0 text-primary/30" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <FiStar size={size} className="text-primary fill-current" />
            </span>
          </span>
        )
      })}
    </span>
  )
}

export default Stars
