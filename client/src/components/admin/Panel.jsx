import React from 'react'
import { FiChevronRight } from 'react-icons/fi'

// ====== Reusable dashboard card wrapper (title + optional "View All") ======
const Panel = ({ title, subtitle, viewAll, action, children, className = '' }) => {
  return (
    <div className={`bg-dark-secondary border border-dark-border rounded-[18px] p-6 ${className}`}>
      {(title || viewAll || action) && (
        <div className="flex items-start justify-between mb-5">
          <div>
            {title && <h3 className="text-[15px] font-ui tracking-wide text-cream font-semibold">{title}</h3>}
            {subtitle && <p className="text-[12px] font-body text-cream-muted mt-1">{subtitle}</p>}
          </div>
          {action}
          {viewAll && (
            <button className="inline-flex items-center gap-1 text-[11px] font-ui tracking-wide text-cream-muted hover:text-primary transition-colors cursor-pointer">
              View All
              <FiChevronRight size={13} />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export default Panel
