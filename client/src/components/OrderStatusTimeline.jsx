import React from 'react'
import { FiClock, FiCreditCard, FiPackage, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi'

// ====== Order status stepper — the "paid" step position depends on payment method ======
// Online (card): pending → paid → processing → shipped → delivered
// Cash on delivery: pending → processing → shipped → delivered → paid (cash collected last)
const buildSteps = (paymentMethod) => {
  const pending = { key: 'pending', label: 'Placed', icon: FiClock }
  const paid = { key: 'paid', label: paymentMethod === 'cod' ? 'Cash Paid' : 'Paid', icon: FiCreditCard }
  const processing = { key: 'processing', label: 'Processing', icon: FiPackage }
  const shipped = { key: 'shipped', label: 'Shipped', icon: FiTruck }
  const delivered = { key: 'delivered', label: 'Delivered', icon: FiCheckCircle }

  return paymentMethod === 'cod'
    ? [pending, processing, shipped, delivered, paid]
    : [pending, paid, processing, shipped, delivered]
}

const OrderStatusTimeline = ({ status, paymentMethod = 'card' }) => {
  // Cancelled — terminal state, show its own banner
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-[12px] px-5 py-4">
        <FiXCircle size={20} className="text-red-400" />
        <div>
          <p className="text-[13px] font-ui font-semibold text-red-400 uppercase tracking-wide">Cancelled</p>
          <p className="text-[12px] font-body text-cream-muted">This order was cancelled and the items were returned to stock.</p>
        </div>
      </div>
    )
  }

  const STEPS = buildSteps(paymentMethod)
  const current = Math.max(0, STEPS.findIndex((s) => s.key === status))

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const Icon = step.icon
        const done = i <= current
        const active = i === current
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  done ? 'bg-primary border-primary text-dark' : 'bg-dark-card border-dark-border text-cream-muted'
                } ${active ? 'ring-4 ring-primary/20' : ''}`}
              >
                <Icon size={16} />
              </span>
              <span className={`text-[10px] font-ui tracking-wide uppercase ${done ? 'text-cream' : 'text-cream-muted/60'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-[2px] mx-1 mb-6 rounded-full ${i < current ? 'bg-primary' : 'bg-dark-border'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default OrderStatusTimeline
