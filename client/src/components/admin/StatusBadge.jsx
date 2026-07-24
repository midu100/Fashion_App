import React from 'react'

// Status → colour map (orders, payments, stock, generic)
const colorMap = {
  Delivered: '#4ade80', Completed: '#4ade80', Active: '#4ade80', Paid: '#4ade80', 'In Stock': '#4ade80', Sent: '#4ade80',
  Processing: '#C9A96E', Pending: '#60a5fa', Scheduled: '#60a5fa', 'Low Stock': '#C9A96E',
  Cancelled: '#f87171', Refunded: '#f87171', 'Out of Stock': '#f87171', Expired: '#f87171', Failed: '#f87171', Inactive: '#8A8278',
  Draft: '#8A8278', Hidden: '#8A8278',
}

// ====== Reusable coloured status pill ======
const StatusBadge = ({ status, dot = true }) => {
  const color = colorMap[status] || '#B8B0A5'
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[12px] font-body font-medium rounded-full px-2.5 py-1"
      style={{ color, background: `${color}14` }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />}
      {status}
    </span>
  )
}

export default StatusBadge
