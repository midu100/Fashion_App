import React, { useState, useEffect } from 'react'
import { FiCalendar, FiMoreHorizontal } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { Link } from 'react-router'
import { statusColor } from '../../data/dashboardData'
import { dashboardServices, agentServices } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { icons } from '../../components/admin/adminIcons'
import StatCard from '../../components/admin/StatCard'
import Panel from '../../components/admin/Panel'
import RevenueChart from '../../components/admin/RevenueChart'
import DonutChart from '../../components/admin/DonutChart'
import AgentAssistant from '../../components/admin/AgentAssistant'

// Small tone → colour map for inventory rows
const toneColor = { warning: '#C9A96E', danger: '#f87171', success: '#4ade80', muted: '#8A8278' }
const sevColor = { high: '#f87171', medium: '#C9A96E', low: '#4ade80' }

const money = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '—')
const PALETTE = ['#C9A96E', '#8A8278', '#4ade80', '#8b5cf6', '#60a5fa', '#f87171']

const Dashboard = () => {
  const { user } = useAuth()
  const [overview, setOverview] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const firstName = (user?.fullName || 'there').split(' ')[0]

  // ====== Load live aggregates (overview + analytics + AI insights)
  useEffect(() => {
    const load = async () => {
      try {
        const [ov, an, ins] = await Promise.all([
          dashboardServices.getOverview(),
          dashboardServices.getAnalytics(),
          agentServices.getInsights().catch(() => ({ insights: [] })),
        ])
        setOverview(ov?.overview || null)
        setAnalytics(an?.analytics || null)
        setInsights(ins?.insights || [])
      } catch (err) {
        console.log(err)
        toast.error(err?.response?.data?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const k = overview?.kpis || {}
  const f = overview?.finance || {}
  const inv = overview?.inventory || {}
  const margin = f.soldRevenue > 0 ? ((f.totalProfit / f.soldRevenue) * 100).toFixed(1) : '0.0'

  // ====== KPI cards (live)
  const kpis = [
    { key: 'revenue', label: 'Realised Revenue', value: money(k.totalRevenue), icon: 'dollar', sub: 'delivered orders' },
    { key: 'orders', label: 'Orders', value: Number(k.totalOrders || 0).toLocaleString(), icon: 'box', sub: `${k.pendingOrders || 0} pending` },
    { key: 'aov', label: 'Average Order Value', value: money(k.avgOrderValue), icon: 'trend', sub: 'per delivered' },
    { key: 'profit', label: 'Net Profit', value: money(f.totalProfit), up: (f.totalProfit || 0) >= 0, change: `${margin}%`, icon: 'wallet', sub: 'realised margin' },
  ]

  // ====== Financial summary (profit counts only DELIVERED sales; pending shown separately)
  const financialSummary = [
    { label: 'Sold Revenue (delivered)', value: money(f.soldRevenue), icon: 'in' },
    { label: 'Cost of Goods (buy)', value: money(f.soldCost), icon: 'out' },
    { label: f.totalProfit >= 0 ? 'Net Profit' : 'Net Loss', value: money(f.totalProfit), icon: 'wallet' },
    { label: 'Pending Revenue', value: money(f.pendingRevenue), icon: 'bag' },
    { label: 'Inventory Capital', value: money(f.inventoryCapital), icon: 'percent' },
  ]

  // ====== Inventory status (live)
  const inventoryStatus = [
    { label: 'Low Stock', value: `${inv.lowStock ?? 0} products`, tone: 'warning', icon: 'alert' },
    { label: 'Out of Stock', value: `${inv.outOfStock ?? 0} products`, tone: 'danger', icon: 'x' },
    { label: 'In Stock', value: `${inv.inStock ?? 0} products`, tone: 'success', icon: 'check' },
    { label: 'Total Products', value: `${inv.totalProducts ?? 0} products`, tone: 'muted', icon: 'box' },
  ]

  const recentOrders = overview?.recentOrders || []
  const topSelling = overview?.topSelling || []
  const maxSold = Math.max(1, ...topSelling.map((t) => t.sold || 0))

  // ---- Orders-by-status donut (live)
  const STATUS_COLORS = { pending: '#60a5fa', paid: '#34d399', processing: '#C9A96E', shipped: '#8b5cf6', delivered: '#4ade80', cancelled: '#f87171' }
  const obs = overview?.ordersByStatus || {}
  const statusTotal = Object.values(obs).reduce((s, n) => s + n, 0) || 1
  const statusSegments = Object.entries(obs)
    .filter(([, c]) => c > 0)
    .map(([status, count]) => ({ label: cap(status), count, pct: Math.round((count / statusTotal) * 100), color: STATUS_COLORS[status] || '#8A8278' }))

  // ---- Charts (live analytics)
  const rev = analytics?.revenue || { labels: [], revenueSeries: [] }
  const cats = analytics?.salesByCategory || []
  const catTotal = cats.reduce((s, c) => s + (c.value || 0), 0)
  const catSegments = cats.map((c, i) => ({
    label: c._id,
    value: money(c.value),
    pct: catTotal ? Math.round((c.value / catTotal) * 100) : 0,
    color: PALETTE[i % PALETTE.length],
  }))

  return (
    <div className="space-y-6">
      {/* ====== Header ====== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[1.7rem] font-display font-bold text-cream flex items-center gap-2">
            Welcome back, {firstName}! <span className="text-[1.4rem]">👋</span>
          </h1>
          <p className="text-[13px] font-body text-cream-muted mt-1">Here's what's happening with your store today.</p>
        </div>
        <button className="inline-flex items-center gap-2.5 bg-dark-secondary border border-dark-border rounded-[12px] px-4 py-2.5 text-[13px] font-ui text-cream hover:border-primary transition-colors cursor-pointer self-start">
          <FiCalendar size={15} className="text-primary" />
          All time
        </button>
      </div>

      {loading && (
        <p className="text-[13px] font-ui tracking-[0.2em] text-cream-muted uppercase animate-pulse">Loading live data…</p>
      )}

      {/* ====== KPI cards ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((stat, i) => (
          <StatCard key={stat.key} stat={stat} index={i} />
        ))}
      </div>

      {/* ====== AI Alerts strip ====== */}
      {insights.length > 0 && (
        <div className="bg-dark-secondary border border-dark-border rounded-[18px] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-ui tracking-[0.15em] text-cream font-semibold uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> AI Alerts
            </h3>
            <Link to="/admin/agents" className="text-[11px] font-ui tracking-wide text-primary hover:text-primary-light transition-colors cursor-pointer">
              Ask the assistant →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {insights.slice(0, 6).map((it, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-dark-card border border-dark-border rounded-[10px] px-3 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: sevColor[it.severity] || '#8A8278' }} />
                <p className="text-[12.5px] font-body text-cream leading-snug">
                  <span className="text-cream-muted/60 uppercase text-[10px] font-ui mr-1.5">{it.category}</span>
                  {it.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====== Revenue + Sales by Channel (visual — static trend) ====== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Panel
          className="xl:col-span-2"
          title="Revenue Overview"
          subtitle="Daily revenue — last 14 days"
          action={
            <span className="flex items-center gap-2 text-[11px] font-body text-cream-muted">
              <span className="w-2 h-2 rounded-full bg-primary" /> Revenue
            </span>
          }
        >
          <RevenueChart labels={rev.labels} thisPeriod={rev.revenueSeries} lastPeriod={[]} />
        </Panel>

        <Panel title="Sales by Category" viewAll>
          {catSegments.length === 0 ? (
            <p className="text-[13px] font-body text-cream-muted py-10 text-center">No sales data yet.</p>
          ) : (
            <>
              <DonutChart segments={catSegments} centerValue={money(catTotal)} centerLabel="Sales" />
              <div className="mt-6 space-y-3">
                {catSegments.map((c) => (
                  <div key={c.label} className="flex items-center gap-3 text-[12px]">
                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    <span className="flex-1 font-body text-cream-muted">{c.label}</span>
                    <span className="font-ui text-cream-muted">{c.pct}%</span>
                    <span className="font-body text-cream font-medium w-20 text-right">{c.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>
      </div>

      {/* ====== Orders / Inventory / Financial ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders overview (live from ordersByStatus) */}
        <Panel title="Orders Overview" viewAll>
          {statusSegments.length === 0 ? (
            <p className="text-[13px] font-body text-cream-muted py-10 text-center">No orders yet.</p>
          ) : (
            <div className="flex items-center gap-6">
              <DonutChart segments={statusSegments} centerValue={Number(k.totalOrders || 0).toLocaleString()} centerLabel="Total Orders" size={150} />
              <div className="flex-1 space-y-3">
                {statusSegments.map((s) => (
                  <div key={s.label} className="flex items-center gap-2.5 text-[12px]">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="flex-1 font-body text-cream-muted">{s.label}</span>
                    <span className="font-ui text-cream-muted">{s.pct}%</span>
                    <span className="font-body text-cream font-medium w-8 text-right">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Panel>

        {/* Inventory status (live) */}
        <Panel title="Inventory Status" viewAll>
          <div className="space-y-4">
            {inventoryStatus.map((row) => {
              const Icon = icons[row.icon]
              return (
                <div key={row.label} className="flex items-center gap-3 pb-4 border-b border-dark-border last:border-0 last:pb-0">
                  <span className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: `${toneColor[row.tone]}1a`, color: toneColor[row.tone] }}>
                    {Icon && <Icon size={16} />}
                  </span>
                  <div>
                    <p className="text-[13px] font-ui text-cream">{row.label}</p>
                    <p className="text-[11px] font-body text-cream-muted">{row.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>

        {/* Financial summary (live — earning / loss) */}
        <Panel title="Financial Summary" viewAll>
          <div className="space-y-4">
            {financialSummary.map((row) => {
              const Icon = icons[row.icon]
              return (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-[10px] border border-dark-border flex items-center justify-center text-primary shrink-0">
                    {Icon && <Icon size={16} />}
                  </span>
                  <span className="flex-1 text-[13px] font-body text-cream-muted">{row.label}</span>
                  <span className="text-[14px] font-body font-semibold text-cream">{row.value}</span>
                </div>
              )
            })}
          </div>
        </Panel>
      </div>

      {/* ====== Recent Orders + Top Selling / Agent ====== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent orders (live) */}
        <Panel className="xl:col-span-2" title="Recent Orders" viewAll>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="text-left text-[11px] font-ui tracking-wide text-cream-muted/70 border-b border-dark-border">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-[12px] font-body text-cream-muted">No orders yet</td></tr>
                ) : (
                  recentOrders.map((o) => (
                    <tr key={o._id} className="border-b border-dark-border/60 last:border-0 text-[13px]">
                      <td className="py-3.5 font-ui text-cream font-medium">{o.orderNumber}</td>
                      <td className="py-3.5 font-body text-cream-muted">{o.shippingAddress?.firstName || 'Guest'}</td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1.5 font-body" style={{ color: statusColor[cap(o.status)] || '#B8B0A5' }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor[cap(o.status)] || '#B8B0A5' }} />
                          {cap(o.status)}
                        </span>
                      </td>
                      <td className="py-3.5 font-body text-cream font-medium">{money(o.total)}</td>
                      <td className="py-3.5 text-cream-muted">
                        <button className="hover:text-primary transition-colors cursor-pointer"><FiMoreHorizontal size={16} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Right column: Top selling + Agent */}
        <div className="space-y-6">
          <Panel title="Top Selling Products" viewAll>
            <div className="space-y-4">
              {topSelling.length === 0 ? (
                <p className="text-[12px] font-body text-cream-muted py-4">No sales data yet.</p>
              ) : (
                topSelling.map((p) => (
                  <div key={p._id || p.name} className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-11 h-11 rounded-[10px] object-cover border border-dark-border shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-ui text-cream truncate">{p.name}</p>
                      <p className="text-[11px] font-body text-cream-muted">{p.sold} sold</p>
                      <div className="mt-1.5 h-1 bg-dark-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round(((p.sold || 0) / maxSold) * 100)}%` }} />
                      </div>
                    </div>
                    <span className="text-[13px] font-body font-semibold text-cream shrink-0">{money(p.revenue)}</span>
                  </div>
                ))
              )}
            </div>
          </Panel>

          <AgentAssistant
            message={`${inv.lowStock ?? 0} products are running low in stock.`}
            onViewSuggestions={() => {}}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
