import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiGrid, FiPackage, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useFlyToCart, CART_TARGET_ID } from '../context/FlyToCartContext'
import { useAuth } from '../context/AuthContext'
import Avatar from './common/Avatar'

const navLinks = [
  { label: 'MEN', to: '/shop' },
  { label: 'WOMEN', to: '/shop' },
  { label: 'COLLECTIONS', to: '/shop' },
  { label: 'LOOKBOOK', to: '/lookbook' },
  { label: 'JOURNAL', to: '/journal' },
  { label: 'ABOUT', to: '/about' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { bump } = useFlyToCart()
  const { pathname } = useLocation()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  // ====== Sign out
  const handleLogout = async () => {
    setAccountOpen(false)
    await logout()
    toast.success('Signed out', { position: 'top-center' })
    navigate('/')
  }

  const bagControls = useAnimationControls()

  // Interior pages aren't the dark hero — keep the bar solid & readable
  const isHome = pathname === '/'
  const solid = scrolled || !isHome

  // ====== Track scroll for navbar bg
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ====== Bump the bag icon when a fly-to-cart lands
  useEffect(() => {
    if (bump > 0) {
      bagControls.start({ scale: [1, 1.4, 0.9, 1], transition: { duration: 0.45, ease: 'easeOut' } })
    }
  }, [bump, bagControls])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          solid
            ? 'bg-dark/95 backdrop-blur-md border-b border-dark-border py-1'
            : 'bg-transparent py-2'
        }`}
      >
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-[75px] md:h-[85px]">
            {/* ====== Logo ====== */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-[32px] h-[32px] border-2 border-primary flex items-center justify-center">
                <span className="text-primary text-[11px] font-ui tracking-[0.2em] font-bold">KN</span>
              </div>
              <span className="text-cream text-[16px] font-ui tracking-[0.3em] font-semibold hidden sm:block group-hover:text-primary transition-colors duration-300">
                KAZIR NATION
              </span>
            </Link>

            {/* ====== Desktop Nav Links ====== */}
            <div className="hidden lg:flex items-center gap-9">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-cream-muted hover:text-primary text-[13px] font-ui tracking-[0.22em] font-semibold transition-colors duration-300 link-hover"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* ====== Right Icons ====== */}
            <div className="flex items-center gap-6">
              <button className="text-cream-muted hover:text-primary transition-colors duration-300 cursor-pointer">
                <FiSearch size={21} />
              </button>
              <Link to="/wishlist" className="text-cream-muted hover:text-primary transition-colors duration-300 cursor-pointer relative hidden sm:block">
                <FiHeart size={21} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4.5 h-4.5 bg-primary text-dark text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="text-cream-muted hover:text-primary transition-colors duration-300 cursor-pointer relative"
              >
                <motion.span id={CART_TARGET_ID} animate={bagControls} className="block">
                  <FiShoppingBag size={21} />
                </motion.span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4.5 h-4.5 bg-primary text-dark text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              {/* ====== Account ====== */}
              {!isAuthenticated ? (
                <Link
                  to="/signin"
                  title="Sign in"
                  className="text-cream-muted hover:text-primary transition-colors duration-300 cursor-pointer hidden sm:block"
                >
                  <FiUser size={21} />
                </Link>
              ) : (
                <div className="relative hidden sm:block">
                  {/* Avatar trigger */}
                  <button
                    onClick={() => setAccountOpen((p) => !p)}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <Avatar src={user?.avatar} name={user?.fullName} size={34} className="group-hover:ring-2 group-hover:ring-primary/40 transition-all" />
                    <span className="text-[12px] font-ui text-cream max-w-[110px] truncate hidden lg:block">{user?.fullName || 'Account'}</span>
                  </button>

                  {accountOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setAccountOpen(false)} />
                      <div className="absolute right-0 top-12 z-40 w-64 bg-dark-secondary border border-dark-border rounded-[14px] p-2 shadow-2xl">
                        {/* Identity header */}
                        <div className="flex items-center gap-3 px-3 py-3 border-b border-dark-border mb-1">
                          <Avatar src={user?.avatar} name={user?.fullName} size={42} />
                          <div className="min-w-0">
                            <p className="text-[13px] font-ui text-cream font-semibold truncate">{user?.fullName || 'Customer'}</p>
                            <p className="text-[11px] font-body text-cream-muted truncate">{user?.email}</p>
                            {user?.role && <span className="text-[9px] font-ui uppercase tracking-wide text-primary">{user.role}</span>}
                          </div>
                        </div>

                        <Link to="/profile" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-body text-cream-muted hover:bg-dark hover:text-cream transition-colors cursor-pointer">
                          <FiUser size={16} /> My Profile
                        </Link>
                        <Link to="/my-orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-body text-cream-muted hover:bg-dark hover:text-cream transition-colors cursor-pointer">
                          <FiPackage size={16} /> My Orders
                        </Link>
                        <Link to="/wishlist" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-body text-cream-muted hover:bg-dark hover:text-cream transition-colors cursor-pointer">
                          <FiHeart size={16} /> Wishlist
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-body text-cream-muted hover:bg-dark hover:text-cream transition-colors cursor-pointer">
                            <FiGrid size={16} /> Dashboard
                          </Link>
                        )}
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-body text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer mt-1 border-t border-dark-border">
                          <FiLogOut size={16} /> Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ====== Mobile Hamburger ====== */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-cream hover:text-primary transition-colors duration-300 cursor-pointer ml-2"
              >
                {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ====== Mobile Menu Overlay ====== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-dark/98 backdrop-blur-xl flex flex-col items-center justify-center gap-6 lg:hidden overflow-y-auto py-24"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <Link
                  to={link.to}
                  className="text-cream text-[22px] font-ui tracking-[0.3em] font-semibold hover:text-primary transition-colors duration-300"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* ====== Account + quick links (mobile) ====== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.06 + 0.05, duration: 0.4 }}
              className="mt-4 pt-7 border-t border-dark-border/70 w-56 flex flex-col items-center gap-5"
            >
              {!isAuthenticated ? (
                <Link
                  to="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-2.5 bg-primary text-dark px-10 py-3.5 text-[12px] font-ui tracking-[0.2em] font-semibold rounded-full hover:bg-primary-light transition-colors active:scale-95"
                >
                  <FiUser size={16} /> SIGN IN
                </Link>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Avatar src={user?.avatar} name={user?.fullName} size={40} />
                    <div className="text-left">
                      <p className="text-[13px] font-ui text-cream font-semibold">{user?.fullName || 'Account'}</p>
                      <p className="text-[11px] font-body text-cream-muted">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4 text-[13px] font-ui tracking-[0.2em] text-cream-muted">
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="hover:text-primary transition-colors">PROFILE</Link>
                    <Link to="/my-orders" onClick={() => setMobileOpen(false)} className="hover:text-primary transition-colors">MY ORDERS</Link>
                    {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="hover:text-primary transition-colors">DASHBOARD</Link>}
                    <button onClick={() => { setMobileOpen(false); handleLogout() }} className="text-red-400 hover:text-red-300 transition-colors tracking-[0.2em] cursor-pointer">SIGN OUT</button>
                  </div>
                </>
              )}

              <div className="flex items-center gap-8 pt-2">
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="flex flex-col items-center gap-1 text-cream-muted hover:text-primary transition-colors">
                  <FiHeart size={19} />
                  <span className="text-[9px] font-ui tracking-[0.15em]">WISHLIST {wishlistCount > 0 ? `(${wishlistCount})` : ''}</span>
                </Link>
                <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex flex-col items-center gap-1 text-cream-muted hover:text-primary transition-colors">
                  <FiShoppingBag size={19} />
                  <span className="text-[9px] font-ui tracking-[0.15em]">BAG {cartCount > 0 ? `(${cartCount})` : ''}</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
