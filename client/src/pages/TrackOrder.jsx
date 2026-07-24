import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { FiSearch } from 'react-icons/fi'
import { orderServices } from '../api'
import { formatPrice } from '../data/products'
import OrderStatusTimeline from '../components/OrderStatusTimeline'

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '')

const TrackOrder = () => {
  const [searchParams] = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const track = async (num) => {
    const value = (num ?? orderNumber).trim()
    if (!value) return setError('Enter your order number.')
    try {
      setLoading(true)
      setError('')
      const res = await orderServices.track(value)
      setOrder(res?.order || null)
    } catch (err) {
      console.log(err)
      setOrder(null)
      setError(err?.response?.data?.message || 'Order not found. Check the number and try again.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-track if arriving with ?order=KN-...
  useEffect(() => {
    const q = searchParams.get('order')
    if (q) track(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ====== Silently re-poll the loaded order so admin status changes appear live (~15s)
  useEffect(() => {
    if (!order?.orderNumber) return
    const t = setInterval(async () => {
      try {
        const res = await orderServices.track(order.orderNumber)
        setOrder(res?.order || null)
      } catch (err) {
        console.log(err)
      }
    }, 15000)
    return () => clearInterval(t)
  }, [order?.orderNumber])

  return (
    <div className="min-h-screen bg-dark text-cream pt-[110px] md:pt-[130px] pb-24 px-6 md:px-16">
      <div className="max-w-[820px] w-full mx-auto">
        <div className="text-center mb-10">
          <span className="text-[10px] font-ui tracking-[0.3em] text-primary block mb-3 uppercase font-medium">Order Status</span>
          <h1 className="text-editorial text-[clamp(2rem,4vw,3rem)] text-cream">Track Your Order</h1>
          <p className="text-[14px] font-body text-cream-muted mt-3">Enter your order number (e.g. KN-12345678) to see where it is.</p>
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => { e.preventDefault(); track() }}
          className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-10"
        >
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-muted" size={16} />
            <input
              value={orderNumber}
              onChange={(e) => { setOrderNumber(e.target.value); setError('') }}
              placeholder="KN-12345678"
              className="w-full bg-dark-card border border-dark-border text-cream placeholder:text-cream-muted/40 pl-11 pr-4 py-3.5 text-[14px] font-body rounded-[10px] outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-primary text-dark text-[12px] font-ui tracking-[0.2em] font-semibold rounded-[10px] hover:bg-primary-light transition-colors cursor-pointer active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? 'TRACKING…' : 'TRACK'}
          </button>
        </form>

        {error && <p className="text-center text-[13px] text-red-400 font-body mb-8">{error}</p>}

        {/* Result */}
        {order && (
          <div className="bg-dark-secondary border border-dark-border rounded-[18px] p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7 pb-5 border-b border-dark-border">
              <div>
                <p className="text-[15px] font-ui text-cream font-semibold">{order.orderNumber}</p>
                <p className="text-[12px] font-body text-cream-muted mt-0.5">Placed on {fmtDate(order.createdAt)}</p>
              </div>
              <p className="text-[18px] font-body font-bold text-cream">{formatPrice(order.total)}</p>
            </div>

            <div className="mb-7 overflow-x-auto">
              <div className="min-w-[460px]">
                <OrderStatusTimeline status={order.status} />
              </div>
            </div>

            <div className="space-y-3">
              {order.items?.map((it, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-14 h-16 shrink-0 rounded-[8px] overflow-hidden bg-dark border border-dark-border">
                    {it.image && <img src={it.image} alt={it.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-ui text-cream truncate">{it.name}</p>
                    <p className="text-[11px] font-body text-cream-muted mt-0.5">{it.size ? `Size ${it.size} · ` : ''}Qty {it.qty}</p>
                  </div>
                  <span className="text-[13px] font-body font-semibold text-cream shrink-0">{formatPrice(it.price * it.qty)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackOrder
