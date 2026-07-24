import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { FiMenu, FiSearch, FiBell, FiMessageSquare, FiMaximize, FiChevronDown, FiLogOut, FiSettings, FiHome } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../common/Avatar'

const AdminTopbar = ({ onMenu }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  // ====== Toggle browser fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  // ====== Sign out
  const handleLogout = async () => {
    setOpen(false)
    await logout()
    toast.success('Signed out', { position: 'top-center' })
    navigate('/signin', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 h-[72px] bg-dark-secondary/90 backdrop-blur-md border-b border-dark-border flex items-center gap-4 px-4 md:px-6">
      {/* Menu (mobile) */}
      <button
        onClick={onMenu}
        className="w-10 h-10 rounded-[10px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-primary hover:border-primary transition-colors cursor-pointer lg:hidden"
      >
        <FiMenu size={18} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xl relative hidden sm:block">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-muted" size={16} />
        <input
          placeholder="Search anything..."
          className="w-full bg-dark-card border border-dark-border rounded-[12px] pl-11 pr-16 py-2.5 text-[13px] font-body text-cream placeholder:text-cream-muted/50 outline-none focus:border-primary transition-colors"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-ui text-cream-muted/60 border border-dark-border rounded px-1.5 py-0.5">
          ⌘K
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-3 ml-auto">
        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-[10px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-primary hover:border-primary transition-colors cursor-pointer">
          <FiBell size={17} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-dark text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
        </button>
        {/* Messages */}
        <button className="w-10 h-10 rounded-[10px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-primary hover:border-primary transition-colors cursor-pointer hidden sm:flex">
          <FiMessageSquare size={17} />
        </button>
        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="w-10 h-10 rounded-[10px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-primary hover:border-primary transition-colors cursor-pointer hidden md:flex"
        >
          <FiMaximize size={16} />
        </button>

        {/* Profile (dropdown with real name / email / role) */}
        <div className="relative pl-2 md:pl-3 md:border-l border-dark-border">
          <button onClick={() => setOpen((p) => !p)} className="flex items-center gap-2.5 cursor-pointer group">
            <Avatar src={user?.avatar} name={user?.fullName} size={36} />
            <div className="hidden md:block leading-tight text-left">
              <p className="text-[13px] font-ui text-cream font-medium group-hover:text-primary transition-colors">{user?.fullName || 'Admin'}</p>
              <p className="text-[11px] font-body text-cream-muted capitalize">{user?.role || 'admin'}</p>
            </div>
            <FiChevronDown size={15} className={`text-cream-muted hidden md:block transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-14 z-40 w-64 bg-dark-secondary border border-dark-border rounded-[14px] p-2 shadow-2xl">
                {/* Identity */}
                <div className="flex items-center gap-3 px-3 py-3 border-b border-dark-border mb-1">
                  <Avatar src={user?.avatar} name={user?.fullName} size={44} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-ui text-cream font-semibold truncate">{user?.fullName || 'Admin'}</p>
                    <p className="text-[11px] font-body text-cream-muted truncate">{user?.email}</p>
                    {user?.role && <span className="text-[9px] font-ui uppercase tracking-wide text-primary">{user.role}</span>}
                  </div>
                </div>

                <Link to="/admin/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-body text-cream-muted hover:bg-dark hover:text-cream transition-colors cursor-pointer">
                  <FiSettings size={16} /> Settings
                </Link>
                <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-body text-cream-muted hover:bg-dark hover:text-cream transition-colors cursor-pointer">
                  <FiHome size={16} /> View Storefront
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-body text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer mt-1 border-t border-dark-border">
                  <FiLogOut size={16} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default AdminTopbar
