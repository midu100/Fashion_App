import React from 'react'

// ====== Reusable admin page header (title + subtitle + optional action) ======
const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-[1.7rem] font-display font-bold text-cream">{title}</h1>
        {subtitle && <p className="text-[13px] font-body text-cream-muted mt-1">{subtitle}</p>}
      </div>
      {action && <div className="self-start">{action}</div>}
    </div>
  )
}

export default PageHeader
