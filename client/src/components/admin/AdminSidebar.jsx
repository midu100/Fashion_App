import React from 'react'
import { NavLink } from 'react-router'
import { FiAward, FiArrowRight, FiHeadphones } from 'react-icons/fi'
import { adminNav } from '../../data/dashboardData'
import { icons } from './adminIcons'

const AdminSidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-dark/70 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] shrink-0 bg-dark-secondary border-r border-dark-border flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* ====== Logo ====== */}
        <div className="h-[72px] flex items-center gap-2.5 px-6 border-b border-dark-border shrink-0">
          <div className="w-[30px] h-[30px] border-2 border-primary flex items-center justify-center rotate-45">
            <span className="text-primary text-[10px] font-ui font-bold -rotate-45">KN</span>
          </div>
          <span className="text-cream text-[15px] font-ui tracking-[0.3em] font-semibold">KAZIR NATION</span>
        </div>

        {/* ====== Nav ====== */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          {adminNav.map((item) => {
            const Icon = icons[item.icon]
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/admin'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-[12px] text-[13.5px] font-ui tracking-wide transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-cream-muted hover:text-cream hover:bg-dark-card border border-transparent'
                  }`
                }
              >
                {Icon && <Icon size={18} className="shrink-0" />}
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-bold bg-primary text-dark rounded-full px-2 py-0.5">
                    {item.badge}
                  </span>
                )}
                {item.tag && (
                  <span className="text-[9px] font-bold bg-primary/20 text-primary rounded-full px-2 py-0.5 uppercase tracking-wider">
                    {item.tag}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* ====== Upgrade card ====== */}
        <div className="px-4 pb-4 shrink-0">
          <div className="bg-gradient-to-br from-dark-card to-dark rounded-[16px] border border-dark-border p-5">
            <div className="flex items-center gap-2 mb-2">
              <FiAward className="text-primary" size={18} />
              <span className="text-[13px] font-ui tracking-wide text-cream font-semibold">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] font-body text-cream-muted leading-relaxed mb-4">
              Unlock all features and get maximum control.
            </p>
            <button className="w-full flex items-center justify-center gap-2 bg-primary text-dark text-[11px] font-ui tracking-[0.15em] font-semibold py-2.5 rounded-[10px] hover:bg-primary-light transition-colors cursor-pointer active:scale-95">
              Upgrade Now
              <FiArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* ====== Help ====== */}
        <div className="px-6 py-4 border-t border-dark-border shrink-0 flex items-start gap-2.5">
          <FiHeadphones className="text-primary mt-0.5" size={16} />
          <div>
            <p className="text-[12px] font-ui text-cream font-medium">Need Help?</p>
            <p className="text-[11px] font-body text-cream-muted/70 leading-snug">Visit our docs or contact support.</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
