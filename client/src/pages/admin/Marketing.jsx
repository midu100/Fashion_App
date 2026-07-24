import React from 'react'
import { FiPlus, FiMail, FiZap, FiBell, FiMessageCircle } from 'react-icons/fi'
import { marketingKpis, campaigns } from '../../data/adminData'
import PageHeader from '../../components/admin/PageHeader'
import StatCard from '../../components/admin/StatCard'
import StatusBadge from '../../components/admin/StatusBadge'
import Panel from '../../components/admin/Panel'

const channelIcon = {
  Email: <FiMail size={15} />,
  Automation: <FiZap size={15} />,
  Push: <FiBell size={15} />,
  SMS: <FiMessageCircle size={15} />,
}

const Marketing = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing"
        subtitle="Campaigns, automations and audience."
        action={
          <button className="inline-flex items-center gap-2 bg-primary text-dark text-[12px] font-ui tracking-[0.15em] font-semibold px-5 py-3 rounded-[10px] hover:bg-primary-light transition-colors cursor-pointer active:scale-95">
            <FiPlus size={16} />
            New Campaign
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {marketingKpis.map((s, i) => (
          <StatCard key={s.key} stat={s} index={i} />
        ))}
      </div>

      <Panel title="Campaigns">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="text-left text-[11px] font-ui tracking-wide text-cream-muted/70 border-b border-dark-border">
                <th className="px-3 py-3 font-medium">Campaign</th>
                <th className="px-3 py-3 font-medium">Channel</th>
                <th className="px-3 py-3 font-medium">Sent</th>
                <th className="px-3 py-3 font-medium">Open Rate</th>
                <th className="px-3 py-3 font-medium">CTR</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.name} className="border-b border-dark-border/60 last:border-0 text-[13px] hover:bg-dark-card/40 transition-colors">
                  <td className="px-3 py-3.5 font-ui text-cream">{c.name}</td>
                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center gap-2 font-body text-cream-muted">
                      <span className="text-primary">{channelIcon[c.channel]}</span>
                      {c.channel}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 font-body text-cream-muted">{c.sent ? c.sent.toLocaleString() : '—'}</td>
                  <td className="px-3 py-3.5 font-body text-cream-muted">{c.opened}</td>
                  <td className="px-3 py-3.5 font-body text-cream-muted">{c.ctr}</td>
                  <td className="px-3 py-3.5"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

export default Marketing
