import React, { useState, useEffect } from 'react'
import { FiHeart } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { dashboardServices } from '../../api'
import PageHeader from '../../components/admin/PageHeader'
import StatCard from '../../components/admin/StatCard'
import Panel from '../../components/admin/Panel'

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—')

const Marketing = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardServices
      .getMarketing()
      .then((res) => setData(res?.marketing || null))
      .catch((err) => { console.log(err); toast.error('Failed to load marketing') })
      .finally(() => setLoading(false))
  }, [])

  const s = data?.stats || {}
  const kpis = [
    { key: 'subs', label: 'Newsletter Subscribers', value: String(s.totalSubscribers ?? 0), icon: 'send', sub: 'total list' },
    { key: 'new', label: 'New Customers (30d)', value: String(s.newCustomers ?? 0), icon: 'users', sub: 'last 30 days' },
    { key: 'total', label: 'Total Customers', value: String(s.totalCustomers ?? 0), icon: 'users', sub: 'registered' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Marketing" subtitle="Audience, subscribers and demand signals." />

      {loading && <p className="text-[13px] font-ui tracking-[0.2em] text-cream-muted uppercase animate-pulse">Loading…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {kpis.map((k, i) => (
          <StatCard key={k.key} stat={k} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most wishlisted — real demand signal */}
        <Panel title="Most Wishlisted" subtitle="What customers want most">
          {!data?.mostWishlisted?.length ? (
            <p className="text-[13px] font-body text-cream-muted py-8 text-center">No wishlist data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.mostWishlisted.map((p) => (
                <div key={p.productId} className="flex items-center gap-3">
                  <img src={p.thumbnail} alt={p.name} className="w-11 h-11 rounded-[10px] object-cover border border-dark-border shrink-0" />
                  <span className="flex-1 text-[13px] font-ui text-cream truncate">{p.name || 'Product'}</span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-body text-primary">
                    <FiHeart size={13} className="fill-current" /> {p.wishlistedBy}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* Recent subscribers */}
        <Panel title="Recent Subscribers">
          {!data?.recentSubscribers?.length ? (
            <p className="text-[13px] font-body text-cream-muted py-8 text-center">No subscribers yet.</p>
          ) : (
            <div className="space-y-2.5">
              {data.recentSubscribers.map((sub) => (
                <div key={sub._id} className="flex items-center justify-between bg-dark-card border border-dark-border rounded-[10px] px-3 py-2.5">
                  <span className="text-[13px] font-body text-cream truncate">{sub.email}</span>
                  <span className="text-[11px] font-body text-cream-muted shrink-0">{fmtDate(sub.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}

export default Marketing
