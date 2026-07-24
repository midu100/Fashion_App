import React, { useState, useEffect } from 'react'
import { FiArrowDownLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { dashboardServices, orderServices } from '../../api'
import PageHeader from '../../components/admin/PageHeader'
import StatCard from '../../components/admin/StatCard'
import Panel from '../../components/admin/Panel'
import RevenueChart from '../../components/admin/RevenueChart'

const money = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—')

const Finances = () => {
  const [finance, setFinance] = useState({ soldRevenue: 0, soldCost: 0, totalProfit: 0, inventoryCapital: 0 })
  const [rev, setRev] = useState({ labels: [], revenueSeries: [] })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      dashboardServices.getOverview(),
      dashboardServices.getAnalytics(),
      orderServices.getAllOrders(),
    ])
      .then(([ov, an, ord]) => {
        setFinance(ov?.overview?.finance || {})
        setRev(an?.analytics?.revenue || { labels: [], revenueSeries: [] })
        setOrders(ord?.orders || [])
      })
      .catch((err) => { console.log(err); toast.error('Failed to load finances') })
      .finally(() => setLoading(false))
  }, [])

  const margin = finance.soldRevenue > 0 ? ((finance.totalProfit / finance.soldRevenue) * 100).toFixed(1) : '0.0'

  const kpis = [
    { key: 'income', label: 'Sold Revenue', value: money(finance.soldRevenue), icon: 'in', sub: 'delivered only' },
    { key: 'cogs', label: 'Cost of Goods', value: money(finance.soldCost), icon: 'out', sub: 'buy price × sold' },
    { key: 'profit', label: finance.totalProfit >= 0 ? 'Net Profit' : 'Net Loss', value: money(finance.totalProfit), up: finance.totalProfit >= 0, change: `${margin}%`, icon: 'wallet', sub: 'realised margin' },
    { key: 'pending', label: 'Pending Revenue', value: money(finance.pendingRevenue), icon: 'bag', sub: `${finance.pendingOrders || 0} in-flight orders` },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Finances" subtitle="Income, cost of goods and profitability." />

      {loading && <p className="text-[13px] font-ui tracking-[0.2em] text-cream-muted uppercase animate-pulse">Loading…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((s, i) => (
          <StatCard key={s.key} stat={s} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Panel className="xl:col-span-2" title="Revenue" subtitle="Daily revenue — last 14 days">
          <RevenueChart labels={rev.labels} thisPeriod={rev.revenueSeries} lastPeriod={[]} />
        </Panel>

        <Panel title="Recent Order Income" viewAll>
          {orders.length === 0 ? (
            <p className="text-[13px] font-body text-cream-muted py-10 text-center">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 6).map((o) => (
                <div key={o._id} className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: '#4ade8014', color: '#4ade80' }}>
                    <FiArrowDownLeft size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-ui text-cream truncate">Order {o.orderNumber}</p>
                    <p className="text-[11px] font-body text-cream-muted">{fmtDate(o.createdAt)} · {o.paymentMethod?.toUpperCase()}</p>
                  </div>
                  <span className="text-[13px] font-body font-semibold shrink-0 text-green-400">+{money(o.total)}</span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}

export default Finances
