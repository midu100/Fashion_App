import React from 'react'
import { FiDownload } from 'react-icons/fi'
import { reports } from '../../data/adminData'
import { icons } from '../../components/admin/adminIcons'
import PageHeader from '../../components/admin/PageHeader'

const Reports = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" subtitle="Generate and download store reports." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((r) => {
          const Icon = icons[r.icon]
          return (
            <div key={r.name} className="group bg-dark-secondary border border-dark-border rounded-[18px] p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between mb-5">
                <span className="w-11 h-11 rounded-[12px] border border-dark-border flex items-center justify-center text-primary">
                  {Icon && <Icon size={19} />}
                </span>
                <span className="text-[10px] font-ui tracking-wide text-cream-muted bg-dark-card border border-dark-border rounded-full px-3 py-1 uppercase">
                  {r.period}
                </span>
              </div>
              <h3 className="text-[15px] font-ui tracking-wide text-cream font-semibold">{r.name}</h3>
              <p className="text-[12.5px] font-body text-cream-muted mt-1.5 leading-relaxed">{r.desc}</p>
              <button className="mt-5 w-full inline-flex items-center justify-center gap-2 border border-dark-border rounded-[10px] py-2.5 text-[12px] font-ui tracking-wide text-cream group-hover:border-primary group-hover:text-primary transition-colors cursor-pointer">
                <FiDownload size={14} />
                Download
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Reports
