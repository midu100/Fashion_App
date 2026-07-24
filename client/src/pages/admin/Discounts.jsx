import React from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiCopy } from 'react-icons/fi'
import { discounts } from '../../data/adminData'
import PageHeader from '../../components/admin/PageHeader'
import StatusBadge from '../../components/admin/StatusBadge'
import Panel from '../../components/admin/Panel'

const Discounts = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Discounts"
        subtitle="Promo codes and automatic discounts."
        action={
          <button className="inline-flex items-center gap-2 bg-primary text-dark text-[12px] font-ui tracking-[0.15em] font-semibold px-5 py-3 rounded-[10px] hover:bg-primary-light transition-colors cursor-pointer active:scale-95">
            <FiPlus size={16} />
            Create Discount
          </button>
        }
      />

      <Panel title="Discount Codes">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="text-left text-[11px] font-ui tracking-wide text-cream-muted/70 border-b border-dark-border">
                <th className="px-3 py-3 font-medium">Code</th>
                <th className="px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">Value</th>
                <th className="px-3 py-3 font-medium">Usage</th>
                <th className="px-3 py-3 font-medium">Expires</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <tr key={d.code} className="border-b border-dark-border/60 last:border-0 text-[13px] hover:bg-dark-card/40 transition-colors">
                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center gap-2 font-ui text-cream font-medium">
                      <span className="bg-dark-card border border-dark-border rounded-[6px] px-2 py-1 text-primary tracking-wider">{d.code}</span>
                      <button className="text-cream-muted hover:text-primary transition-colors cursor-pointer"><FiCopy size={13} /></button>
                    </span>
                  </td>
                  <td className="px-3 py-3.5 font-body text-cream-muted">{d.type}</td>
                  <td className="px-3 py-3.5 font-body text-cream font-medium">{d.value}</td>
                  <td className="px-3 py-3.5 font-body text-cream-muted">{d.usage} / {d.limit}</td>
                  <td className="px-3 py-3.5 font-body text-cream-muted">{d.expires}</td>
                  <td className="px-3 py-3.5"><StatusBadge status={d.status} /></td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button className="w-8 h-8 rounded-[8px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-primary hover:border-primary transition-colors cursor-pointer"><FiEdit2 size={14} /></button>
                      <button className="w-8 h-8 rounded-[8px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-red-400 hover:border-red-400/50 transition-colors cursor-pointer"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

export default Discounts
