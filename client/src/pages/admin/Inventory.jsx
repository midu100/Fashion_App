import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { productServices } from '../../api'
import PageHeader from '../../components/admin/PageHeader'
import StatCard from '../../components/admin/StatCard'
import StatusBadge from '../../components/admin/StatusBadge'
import Panel from '../../components/admin/Panel'

// Stock bar colour by level
const barColor = (stock) => (stock <= 0 ? '#f87171' : stock <= 10 ? '#C9A96E' : '#4ade80')
const stockStatus = (s) => (s <= 0 ? 'Out of Stock' : s <= 10 ? 'Low Stock' : 'In Stock')

const Inventory = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productServices
      .getAdminProducts()
      .then((res) => setItems(res?.productList || []))
      .catch((err) => { console.log(err); toast.error('Failed to load inventory') })
      .finally(() => setLoading(false))
  }, [])

  const totalProducts = items.length
  const inStock = items.filter((p) => (p.totalStock ?? 0) > 10).length
  const lowStock = items.filter((p) => (p.totalStock ?? 0) > 0 && (p.totalStock ?? 0) <= 10).length
  const outOfStock = items.filter((p) => (p.totalStock ?? 0) <= 0).length

  const kpis = [
    { key: 'total', label: 'Total Products', value: String(totalProducts), icon: 'box', sub: 'in catalog' },
    { key: 'in', label: 'In Stock', value: String(inStock), icon: 'check', sub: 'healthy levels' },
    { key: 'low', label: 'Low Stock', value: String(lowStock), icon: 'alert', sub: 'needs restock' },
    { key: 'out', label: 'Out of Stock', value: String(outOfStock), icon: 'x', sub: 'restock now' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" subtitle="Monitor stock levels and restock alerts." />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((s, i) => (
          <StatCard key={s.key} stat={s} index={i} />
        ))}
      </div>

      <Panel title="Stock Levels">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="text-left text-[11px] font-ui tracking-wide text-cream-muted/70 border-b border-dark-border">
                <th className="px-3 py-3 font-medium">Product</th>
                <th className="px-3 py-3 font-medium">Category</th>
                <th className="px-3 py-3 font-medium">Variants</th>
                <th className="px-3 py-3 font-medium w-[220px]">Stock</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const stock = it.totalStock ?? 0
                return (
                  <tr key={it._id} className="border-b border-dark-border/60 last:border-0 text-[13px] hover:bg-dark-card/40 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <img src={it.thumbnail} alt={it.title} className="w-10 h-10 rounded-[8px] object-cover border border-dark-border shrink-0" />
                        <span className="font-ui text-cream">{it.title}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 font-body text-cream-muted">{it.category?.name || '—'}</td>
                    <td className="px-3 py-3.5 font-body text-cream-muted">{it.variants?.length || 0}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-dark-border rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.min(100, stock)}%`, background: barColor(stock) }} />
                        </div>
                        <span className="text-[12px] font-body text-cream-muted w-8 text-right">{stock}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5"><StatusBadge status={stockStatus(stock)} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {loading ? (
            <p className="text-center py-14 text-[13px] font-ui tracking-wide text-cream-muted uppercase animate-pulse">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-center py-14 text-[13px] font-ui tracking-wide text-cream-muted uppercase">No products</p>
          ) : null}
        </div>
      </Panel>
    </div>
  )
}

export default Inventory
