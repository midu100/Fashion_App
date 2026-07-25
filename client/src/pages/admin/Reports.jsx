import React, { useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { dashboardServices } from '../../api'
import { icons } from '../../components/admin/adminIcons'
import PageHeader from '../../components/admin/PageHeader'

// Each report maps to a real backend report type (GET /dashboard/report/:type)
const REPORTS = [
  { type: 'sales', name: 'Sales Report', desc: 'Realised orders — revenue, items & status', period: 'Live', icon: 'chart' },
  { type: 'inventory', name: 'Inventory Report', desc: 'Stock levels, price & cost per product', period: 'Live', icon: 'layers' },
  { type: 'customers', name: 'Customer Report', desc: 'Customers, orders & lifetime spend', period: 'Live', icon: 'users' },
  { type: 'financial', name: 'Financial Statement', desc: 'Revenue, cost, profit, margin & capital', period: 'Live', icon: 'dollar' },
  { type: 'products', name: 'Product Performance', desc: 'Per-product units, revenue & profit', period: 'Live', icon: 'box' },
]

// Build a CSV string from { columns, rows } and trigger a download
const downloadCsv = (filename, columns, rows) => {
  const esc = (v) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const csv = [columns.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const Reports = () => {
  const [busy, setBusy] = useState('')

  const handleDownload = async (report) => {
    try {
      setBusy(report.type)
      const res = await dashboardServices.getReport(report.type)
      const { columns, rows } = res?.report || {}
      if (!columns?.length) return toast.error('No data for this report', { position: 'top-center' })
      const stamp = new Date().toISOString().slice(0, 10)
      downloadCsv(`kazir-nation-${report.type}-${stamp}.csv`, columns, rows)
      toast.success(`${report.name} downloaded (${rows.length} rows)`, { position: 'top-center' })
    } catch (err) {
      console.log(err)
      toast.error('Could not generate report', { position: 'top-center' })
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" subtitle="Generate and download live reports from your store data (CSV)." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {REPORTS.map((r) => {
          const Icon = icons[r.icon]
          return (
            <div key={r.type} className="group bg-dark-secondary border border-dark-border rounded-[18px] p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between mb-5">
                <span className="w-11 h-11 rounded-[12px] border border-dark-border flex items-center justify-center text-primary">
                  {Icon && <Icon size={19} />}
                </span>
                <span className="text-[10px] font-ui tracking-wide text-cream-muted bg-dark-card border border-dark-border rounded-full px-3 py-1 uppercase">{r.period}</span>
              </div>
              <h3 className="text-[15px] font-ui tracking-wide text-cream font-semibold">{r.name}</h3>
              <p className="text-[12.5px] font-body text-cream-muted mt-1.5 leading-relaxed">{r.desc}</p>
              <button
                onClick={() => handleDownload(r)}
                disabled={busy === r.type}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 border border-dark-border rounded-[10px] py-2.5 text-[12px] font-ui tracking-wide text-cream group-hover:border-primary group-hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
              >
                <FiDownload size={14} />
                {busy === r.type ? 'Generating…' : 'Download CSV'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Reports
