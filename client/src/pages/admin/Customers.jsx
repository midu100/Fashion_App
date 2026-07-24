import React, { useState, useEffect } from 'react'
import { FiSearch, FiMail } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { dashboardServices } from '../../api'
import PageHeader from '../../components/admin/PageHeader'
import StatCard from '../../components/admin/StatCard'
import StatusBadge from '../../components/admin/StatusBadge'
import Panel from '../../components/admin/Panel'

const money = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—')

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [stats, setStats] = useState({ totalCustomers: 0, avgLtv: 0, activeBuyers: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    dashboardServices
      .getCustomers()
      .then((res) => { setCustomers(res?.customers || []); setStats(res?.stats || {}) })
      .catch((err) => { console.log(err); toast.error('Failed to load customers') })
      .finally(() => setLoading(false))
  }, [])

  const filtered = customers.filter(
    (c) => c.fullName?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  )

  const kpis = [
    { key: 'total', label: 'Total Customers', value: String(stats.totalCustomers || 0), icon: 'users', sub: 'registered' },
    { key: 'active', label: 'Active Buyers', value: String(stats.activeBuyers || 0), icon: 'users', sub: 'placed an order' },
    { key: 'ltv', label: 'Avg. Lifetime Value', value: money(stats.avgLtv), icon: 'dollar', sub: 'per customer' },
    { key: 'guest', label: 'Guest Checkouts', value: 'Allowed', icon: 'bag', sub: 'no account needed' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" subtitle="Your customer base and lifetime value." />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((s, i) => (
          <StatCard key={s.key} stat={s} index={i} />
        ))}
      </div>

      <Panel
        title="All Customers"
        action={
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-muted" size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="bg-dark-card border border-dark-border rounded-[10px] pl-10 pr-4 py-2 text-[12px] font-body text-cream placeholder:text-cream-muted/40 outline-none focus:border-primary transition-colors w-52"
            />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="text-left text-[11px] font-ui tracking-wide text-cream-muted/70 border-b border-dark-border">
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Orders</th>
                <th className="px-3 py-3 font-medium">Total Spent</th>
                <th className="px-3 py-3 font-medium">Joined</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id} className="border-b border-dark-border/60 last:border-0 text-[13px] hover:bg-dark-card/40 transition-colors">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      {c.avatar ? (
                        <img src={c.avatar} alt={c.fullName} className="w-9 h-9 rounded-full object-cover border border-dark-border" />
                      ) : (
                        <span className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[13px] font-ui font-semibold border border-primary/20">
                          {(c.fullName || 'C').charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div>
                        <p className="font-ui text-cream">{c.fullName || 'Customer'}</p>
                        <p className="text-[11px] font-body text-cream-muted">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-body text-cream-muted">{c.orders}</td>
                  <td className="px-3 py-3 font-body text-cream font-medium">{money(c.spent)}</td>
                  <td className="px-3 py-3 font-body text-cream-muted">{fmtDate(c.createdAt)}</td>
                  <td className="px-3 py-3"><StatusBadge status={c.isVerified ? 'Active' : 'Pending'} /></td>
                  <td className="px-3 py-3 text-right">
                    <a href={`mailto:${c.email}`} className="w-8 h-8 rounded-[8px] border border-dark-border inline-flex items-center justify-center text-cream-muted hover:text-primary hover:border-primary transition-colors cursor-pointer">
                      <FiMail size={14} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? (
            <p className="text-center py-14 text-[13px] font-ui tracking-wide text-cream-muted uppercase animate-pulse">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-14 text-[13px] font-ui tracking-wide text-cream-muted uppercase">No customers found</p>
          ) : null}
        </div>
      </Panel>
    </div>
  )
}

export default Customers
