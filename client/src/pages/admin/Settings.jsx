import React, { useState } from 'react'
import PageHeader from '../../components/admin/PageHeader'
import Panel from '../../components/admin/Panel'
import ProfileForm from '../../components/ProfileForm'

const inputClass =
  'w-full bg-dark-card border border-dark-border text-cream placeholder:text-cream-muted/40 px-4 py-2.5 text-[13px] font-body rounded-[10px] outline-none focus:border-primary transition-colors'
const labelClass = 'text-[11px] font-ui tracking-wide text-cream-muted uppercase block mb-1.5'

// Simple toggle
const Toggle = ({ on, onClick }) => (
  <button
    onClick={onClick}
    className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative shrink-0 ${on ? 'bg-primary' : 'bg-dark-border'}`}
  >
    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-cream transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
  </button>
)

const Settings = () => {
  const [store, setStore] = useState({ name: 'KAZIR NATION', email: 'hello@kazirnation.com', currency: 'USD ($)', country: 'Bangladesh' })
  const [prefs, setPrefs] = useState({ orderEmails: true, lowStockAlerts: true, marketing: false, weeklyReport: true })

  const onStore = (e) => setStore((p) => ({ ...p, [e.target.name]: e.target.value }))
  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }))

  const prefRows = [
    { key: 'orderEmails', label: 'Order confirmation emails', desc: 'Send an email on every new order' },
    { key: 'lowStockAlerts', label: 'Low stock alerts', desc: 'Notify when a product runs low' },
    { key: 'marketing', label: 'Marketing emails', desc: 'Product tips & platform news' },
    { key: 'weeklyReport', label: 'Weekly summary report', desc: 'A digest of store performance' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Store profile and preferences." />

      {/* Profile — real, with avatar upload */}
      <Panel title="Admin Profile">
        <ProfileForm />
      </Panel>

      {/* Store details */}
      <Panel title="Store Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Store Name</label>
            <input name="name" value={store.name} onChange={onStore} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Support Email</label>
            <input name="email" value={store.email} onChange={onStore} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <input name="currency" value={store.currency} onChange={onStore} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <input name="country" value={store.country} onChange={onStore} className={inputClass} />
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button className="bg-primary text-dark text-[12px] font-ui tracking-[0.15em] font-semibold px-6 py-2.5 rounded-[10px] hover:bg-primary-light transition-colors cursor-pointer active:scale-95">
            Save Changes
          </button>
        </div>
      </Panel>

      {/* Notifications */}
      <Panel title="Notifications">
        <div className="space-y-1">
          {prefRows.map((row) => (
            <div key={row.key} className="flex items-center justify-between py-3.5 border-b border-dark-border last:border-0">
              <div>
                <p className="text-[13px] font-ui text-cream">{row.label}</p>
                <p className="text-[11px] font-body text-cream-muted mt-0.5">{row.desc}</p>
              </div>
              <Toggle on={prefs[row.key]} onClick={() => toggle(row.key)} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

export default Settings
