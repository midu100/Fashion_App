import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { FiPackage } from 'react-icons/fi'
import { orderServices } from '../api'
import { formatPrice } from '../data/products'
import OrderStatusTimeline from '../components/OrderStatusTimeline'

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '')

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // ====== Load + auto-refresh so admin status changes appear live (~15s)
  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const res = await orderServices.getMyOrders()
        if (active) setOrders(res?.orders || [])
      } catch (err) {
        console.log(err)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    const t = setInterval(load, 15000)
    return () => { active = false; clearInterval(t) }
  }, [])

  return (
    <div className="min-h-screen bg-dark text-cream pt-[110px] md:pt-[130px] pb-24 px-6 md:px-16">
      <div className="max-w-[1000px] w-full mx-auto">
        {/* ====== Header ====== */}
        <div className="mb-10 border-b border-dark-border pb-6">
          <span className="text-[10px] font-ui tracking-[0.3em] text-primary block mb-3 uppercase font-medium">Your Account</span>
          <h1 className="text-editorial text-[clamp(2rem,4vw,3rem)] text-cream">My Orders</h1>
          <p className="text-[14px] font-body text-cream-muted mt-3">Track the status of every order you've placed.</p>
        </div>

        {loading ? (
          <p className="text-center py-24 text-[13px] font-ui tracking-[0.2em] text-cream-muted uppercase animate-pulse">Loading orders…</p>
        ) : orders.length === 0 ? (
          <div className="border border-dashed border-dark-border rounded-[16px] py-24 text-center">
            <FiPackage size={34} className="text-cream-muted/50 mx-auto mb-5" />
            <p className="text-[14px] font-body text-cream-muted mb-6">You haven't placed any orders yet.</p>
            <Link to="/shop" className="inline-block px-8 py-3.5 bg-primary text-dark text-[11px] font-ui tracking-[0.2em] font-semibold rounded-[8px] hover:bg-primary-light transition-colors cursor-pointer">
              START SHOPPING
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((o) => (
              <div key={o._id} className="bg-dark-secondary border border-dark-border rounded-[18px] p-6 md:p-8">
                {/* Head */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7 pb-5 border-b border-dark-border">
                  <div>
                    <p className="text-[15px] font-ui text-cream font-semibold">{o.orderNumber}</p>
                    <p className="text-[12px] font-body text-cream-muted mt-0.5">Placed on {fmtDate(o.createdAt)}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-[18px] font-body font-bold text-cream">{formatPrice(o.total)}</p>
                    <p className="text-[11px] font-body text-cream-muted uppercase">{o.paymentMethod} · {o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-7 overflow-x-auto">
                  <div className="min-w-[460px]">
                    <OrderStatusTimeline status={o.status} paymentMethod={o.paymentMethod} />
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {o.items?.map((it, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-14 h-16 shrink-0 rounded-[8px] overflow-hidden bg-dark border border-dark-border">
                        {it.image && <img src={it.image} alt={it.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-ui text-cream truncate">{it.name}</p>
                        <p className="text-[11px] font-body text-cream-muted mt-0.5">
                          {it.size ? `Size ${it.size} · ` : ''}Qty {it.qty}
                        </p>
                      </div>
                      <span className="text-[13px] font-body font-semibold text-cream shrink-0">{formatPrice(it.price * it.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
