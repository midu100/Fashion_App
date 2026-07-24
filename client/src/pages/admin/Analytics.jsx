import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { dashboardServices } from '../../api'
import PageHeader from '../../components/admin/PageHeader'
import StatCard from '../../components/admin/StatCard'
import Panel from '../../components/admin/Panel'
import RevenueChart from '../../components/admin/RevenueChart'
import DonutChart from '../../components/admin/DonutChart'

const money = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
const PALETTE = ['#C9A96E', '#8A8278', '#4ade80', '#8b5cf6', '#60a5fa', '#f87171']

const Analytics = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardServices
      .getAnalytics()
      .then((res) => setData(res?.analytics || null))
      .catch((err) => { console.log(err); toast.error('Failed to load analytics') })
      .finally(() => setLoading(false))
  }, [])

  const rev = data?.revenue || { labels: [], revenueSeries: [], ordersSeries: [] }
  const cats = data?.salesByCategory || []

  const total14 = rev.revenueSeries.reduce((s, v) => s + v, 0)
  const orders14 = rev.ordersSeries.reduce((s, v) => s + v, 0)
  const aov = orders14 ? total14 / orders14 : 0
  const topCat = cats[0]?._id || '—'
  const catTotal = cats.reduce((s, c) => s + (c.value || 0), 0)

  const kpis = [
    { key: 'rev', label: 'Revenue (14d)', value: money(total14), icon: 'dollar', sub: 'last 14 days' },
    { key: 'orders', label: 'Orders (14d)', value: String(orders14), icon: 'bag', sub: 'last 14 days' },
    { key: 'aov', label: 'Avg. Order Value', value: money(aov), icon: 'trend', sub: 'last 14 days' },
    { key: 'top', label: 'Top Category', value: topCat, icon: 'tag', sub: 'by sales' },
  ]

  const segments = cats.map((c, i) => ({
    label: c._id,
    value: money(c.value),
    pct: catTotal ? Math.round((c.value / catTotal) * 100) : 0,
    color: PALETTE[i % PALETTE.length],
  }))

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Revenue trend and category performance." />

      {loading && <p className="text-[13px] font-ui tracking-[0.2em] text-cream-muted uppercase animate-pulse">Loading…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((s, i) => (
          <StatCard key={s.key} stat={s} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Panel className="xl:col-span-2" title="Revenue Overview" subtitle="Daily revenue — last 14 days">
          <RevenueChart labels={rev.labels} thisPeriod={rev.revenueSeries} lastPeriod={[]} />
        </Panel>

        <Panel title="Sales by Category" viewAll>
          {segments.length === 0 ? (
            <p className="text-[13px] font-body text-cream-muted py-10 text-center">No sales data yet.</p>
          ) : (
            <>
              <DonutChart segments={segments} centerValue={money(catTotal)} centerLabel="Sales" />
              <div className="mt-6 space-y-3">
                {segments.map((s) => (
                  <div key={s.label} className="flex items-center gap-3 text-[12px]">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="flex-1 font-body text-cream-muted">{s.label}</span>
                    <span className="font-ui text-cream-muted">{s.pct}%</span>
                    <span className="font-body text-cream font-medium w-20 text-right">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>
      </div>
    </div>
  )
}

export default Analytics
