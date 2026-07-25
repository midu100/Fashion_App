import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import { FiMenu, FiSearch, FiBell, FiCpu, FiMaximize, FiChevronDown, FiLogOut, FiSettings, FiHome, FiBox, FiAlertTriangle, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { adminNav } from '../../data/dashboardData'
import { agentServices, productServices } from '../../api'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../common/Avatar'

const sevColor = { high: '#f87171', medium: '#C9A96E', low: '#4ade80' }
const catRoute = { inventory: '/admin/inventory', financial: '/admin/finances', orders: '/admin/orders' }
const READ_KEY = 'kn_admin_read_notifs'

const AdminTopbar = ({ onMenu }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // profile
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchFocus, setSearchFocus] = useState(false)

  const [notifs, setNotifs] = useState([])
  const [readSet, setReadSet] = useState([])
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')

  // ====== Load notifications (AI insights) + products (for search)
  useEffect(() => {
    try { setReadSet(JSON.parse(localStorage.getItem(READ_KEY) || '[]')) } catch { setReadSet([]) }
    agentServices.getInsights().then((r) => setNotifs(r?.insights || [])).catch(() => {})
    productServices.getAdminProducts().then((r) => setProducts(r?.productList || [])).catch(() => {})
  }, [])

  const unread = notifs.filter((n) => !readSet.includes(n.message))
  const unreadCount = unread.length

  const markAllRead = () => {
    const all = notifs.map((n) => n.message)
    setReadSet(all)
    try { localStorage.setItem(READ_KEY, JSON.stringify(all)) } catch { /* ignore */ }
  }

  // ====== Global search: admin pages + products
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return { pages: [], products: [] }
    return {
      pages: adminNav.filter((n) => n.label.toLowerCase().includes(q)).slice(0, 4),
      products: products.filter((p) => p.title?.toLowerCase().includes(q)).slice(0, 5),
    }
  }, [query, products])
  const hasResults = results.pages.length > 0 || results.products.length > 0

  const goto = (to) => { setQuery(''); setSearchFocus(false); navigate(to) }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    toast.success('Signed out', { position: 'top-center' })
    navigate('/signin', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 h-[72px] bg-dark-secondary/90 backdrop-blur-md border-b border-dark-border flex items-center gap-4 px-4 md:px-6">
      {/* Menu (mobile) */}
      <button onClick={onMenu} className="w-10 h-10 rounded-[10px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-primary hover:border-primary transition-colors cursor-pointer lg:hidden">
        <FiMenu size={18} />
      </button>

      {/* ====== Search ====== */}
      <div className="flex-1 max-w-xl relative hidden sm:block">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-muted z-10" size={16} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setTimeout(() => setSearchFocus(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const first = results.products[0] ? '/admin/products' : results.pages[0]?.to
              if (first) goto(first)
            }
          }}
          placeholder="Search products & pages..."
          className="w-full bg-dark-card border border-dark-border rounded-[12px] pl-11 pr-4 py-2.5 text-[13px] font-body text-cream placeholder:text-cream-muted/50 outline-none focus:border-primary transition-colors"
        />
        {searchFocus && query.trim() && (
          <div className="absolute left-0 right-0 top-12 z-40 bg-dark-secondary border border-dark-border rounded-[12px] p-2 shadow-2xl max-h-[360px] overflow-y-auto">
            {!hasResults ? (
              <p className="text-[12px] font-body text-cream-muted text-center py-4">No matches for "{query}"</p>
            ) : (
              <>
                {results.pages.length > 0 && (
                  <>
                    <p className="text-[10px] font-ui tracking-wide text-cream-muted/50 uppercase px-2 py-1">Pages</p>
                    {results.pages.map((p) => (
                      <button key={p.to} onMouseDown={() => goto(p.to)} className="w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-body text-cream-muted hover:bg-dark hover:text-cream transition-colors cursor-pointer text-left">
                        <FiHome size={14} /> {p.label}
                      </button>
                    ))}
                  </>
                )}
                {results.products.length > 0 && (
                  <>
                    <p className="text-[10px] font-ui tracking-wide text-cream-muted/50 uppercase px-2 py-1 mt-1">Products</p>
                    {results.products.map((p) => (
                      <button key={p._id} onMouseDown={() => goto('/admin/products')} className="w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-body text-cream-muted hover:bg-dark hover:text-cream transition-colors cursor-pointer text-left">
                        <img src={p.thumbnail} alt={p.title} className="w-7 h-7 rounded-[6px] object-cover border border-dark-border shrink-0" />
                        <span className="truncate">{p.title}</span>
                      </button>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3 ml-auto">
        {/* ====== Notifications ====== */}
        <div className="relative">
          <button onClick={() => setNotifOpen((p) => !p)} className="relative w-10 h-10 rounded-[10px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-primary hover:border-primary transition-colors cursor-pointer">
            <FiBell size={17} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-primary text-dark text-[9px] font-bold rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-12 z-40 w-80 bg-dark-secondary border border-dark-border rounded-[14px] shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
                  <p className="text-[13px] font-ui text-cream font-semibold">Notifications</p>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[11px] font-ui text-primary hover:text-primary-light transition-colors cursor-pointer">Mark all read</button>
                  )}
                </div>
                <div className="max-h-[360px] overflow-y-auto">
                  {notifs.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <FiCheck size={22} className="text-green-400 mx-auto mb-2" />
                      <p className="text-[12px] font-body text-cream-muted">All caught up — no alerts.</p>
                    </div>
                  ) : (
                    notifs.map((n, i) => {
                      const isUnread = !readSet.includes(n.message)
                      return (
                        <button
                          key={i}
                          onClick={() => { setNotifOpen(false); navigate(catRoute[n.category] || '/admin/agents') }}
                          className={`w-full flex items-start gap-3 px-4 py-3 border-b border-dark-border/60 last:border-0 hover:bg-dark transition-colors cursor-pointer text-left ${isUnread ? '' : 'opacity-55'}`}
                        >
                          <span className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${sevColor[n.severity]}1a`, color: sevColor[n.severity] }}>
                            <FiAlertTriangle size={13} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[12.5px] font-body text-cream leading-snug">{n.message}</p>
                            <p className="text-[10px] font-ui tracking-wide text-cream-muted/60 uppercase mt-0.5">{n.category}</p>
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>
                <Link to="/admin/agents" onClick={() => setNotifOpen(false)} className="block text-center py-2.5 text-[12px] font-ui text-primary hover:bg-dark transition-colors cursor-pointer border-t border-dark-border">
                  Open AI Assistant
                </Link>
              </div>
            </>
          )}
        </div>

        {/* ====== AI Assistant quick link (was inert "messages") ====== */}
        <Link to="/admin/agents" title="AI Assistant" className="w-10 h-10 rounded-[10px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-primary hover:border-primary transition-colors cursor-pointer hidden sm:flex">
          <FiCpu size={17} />
        </Link>

        {/* Fullscreen */}
        <button onClick={toggleFullscreen} title="Fullscreen" className="w-10 h-10 rounded-[10px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-primary hover:border-primary transition-colors cursor-pointer hidden md:flex">
          <FiMaximize size={16} />
        </button>

        {/* ====== Profile ====== */}
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
