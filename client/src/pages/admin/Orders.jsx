import React, { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { orderServices } from '../../api'
import PageHeader from '../../components/admin/PageHeader'
import StatCard from '../../components/admin/StatCard'
import StatusBadge from '../../components/admin/StatusBadge'
import Panel from '../../components/admin/Panel'

const STATUS_TABS = ['All', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
const STATUS_OPTIONS = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

const money = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '—')
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—')

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('All')

  // ====== Load all orders (admin)
  const loadOrders = useCallback(async () => {
    try {
      const res = await orderServices.getAllOrders()
      setOrders(res?.orders || [])
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadOrders() }, [loadOrders])

  const filtered = tab === 'All' ? orders : orders.filter((o) => o.status === tab)

  // ====== KPIs derived from live orders
  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0)
  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length
  const kpis = [
    { key: 'total', label: 'Total Orders', value: orders.length.toLocaleString(), icon: 'box', sub: 'all-time' },
    { key: 'rev', label: 'Revenue', value: money(revenue), icon: 'dollar', sub: 'all-time' },
    { key: 'pending', label: 'Pending', value: pendingCount.toLocaleString(), icon: 'alert', sub: 'awaiting action' },
    { key: 'delivered', label: 'Delivered', value: deliveredCount.toLocaleString(), icon: 'check', sub: 'completed' },
  ]

  // ====== Change a status → PUT /order/:id/status
  const handleStatus = async (order, status) => {
    const prev = order.status
    setOrders((list) => list.map((o) => (o._id === order._id ? { ...o, status } : o)))
    try {
      await orderServices.updateStatus(order._id, status)
      toast.success('Order updated', { position: 'top-center' })
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message || 'Update failed')
      setOrders((list) => list.map((o) => (o._id === order._id ? { ...o, status: prev } : o)))
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" subtitle="Track and manage customer orders." />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((s, i) => (
          <StatCard key={s.key} stat={s} index={i} />
        ))}
      </div>

      <Panel>
        {/* Status tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          {STATUS_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-[11px] font-ui tracking-wide font-semibold capitalize transition-colors cursor-pointer border ${
                tab === t ? 'bg-primary text-dark border-primary' : 'border-dark-border text-cream-muted hover:text-cream'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="text-left text-[11px] font-ui tracking-wide text-cream-muted/70 border-b border-dark-border">
                <th className="px-3 py-3 font-medium">Order</th>
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Items</th>
                <th className="px-3 py-3 font-medium">Payment</th>
                <th className="px-3 py-3 font-medium">Amount</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium text-right">Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o._id} className="border-b border-dark-border/60 last:border-0 text-[13px] hover:bg-dark-card/40 transition-colors">
                  <td className="px-3 py-3.5 font-ui text-cream font-medium">{o.orderNumber}</td>
                  <td className="px-3 py-3.5">
                    <p className="font-ui text-cream">{o.shippingAddress?.firstName} {o.shippingAddress?.lastName}</p>
                    <p className="text-[11px] font-body text-cream-muted">{o.shippingAddress?.email}</p>
                  </td>
                  <td className="px-3 py-3.5 font-body text-cream-muted">{fmtDate(o.createdAt)}</td>
                  <td className="px-3 py-3.5 font-body text-cream-muted">{o.items?.length || 0}</td>
                  <td className="px-3 py-3.5 font-body text-cream-muted uppercase">{o.paymentMethod}</td>
                  <td className="px-3 py-3.5 font-body text-cream font-medium">{money(o.total)}</td>
                  <td className="px-3 py-3.5"><StatusBadge status={cap(o.status)} /></td>
                  <td className="px-3 py-3.5 text-right">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatus(o, e.target.value)}
                      className="bg-dark-card border border-dark-border text-cream text-[12px] font-body rounded-[8px] px-2 py-1.5 outline-none focus:border-primary cursor-pointer capitalize"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-dark-card capitalize">{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? (
            <p className="text-center py-14 text-[13px] font-ui tracking-wide text-cream-muted uppercase animate-pulse">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-14 text-[13px] font-ui tracking-wide text-cream-muted uppercase">No {tab === 'All' ? '' : tab} orders</p>
          ) : null}
        </div>
      </Panel>
    </div>
  )
}

export default Orders
