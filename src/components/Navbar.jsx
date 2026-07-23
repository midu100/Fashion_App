import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi'

const navLinks = ['MEN', 'WOMEN', 'COLLECTIONS', 'LOOKBOOK', 'JOURNAL', 'ABOUT']

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // ====== Track scroll for navbar bg
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-dark/95 backdrop-blur-md border-b border-dark-border py-1'
            : 'bg-transparent py-2'
        }`}
      >
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-[75px] md:h-[85px]">
            {/* ====== Logo ====== */}
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-[32px] h-[32px] border-2 border-primary flex items-center justify-center">
                <span className="text-primary text-[11px] font-ui tracking-[0.2em] font-bold">KN</span>
              </div>
              <span className="text-cream text-[16px] font-ui tracking-[0.3em] font-semibold hidden sm:block group-hover:text-primary transition-colors duration-300">
                KAZIR NATION
              </span>
            </a>

            {/* ====== Desktop Nav Links ====== */}
            <div className="hidden lg:flex items-center gap-9">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-cream-muted hover:text-primary text-[13px] font-ui tracking-[0.22em] font-semibold transition-colors duration-300 link-hover"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* ====== Right Icons ====== */}
            <div className="flex items-center gap-6">
              <button className="text-cream-muted hover:text-primary transition-colors duration-300 cursor-pointer">
                <FiSearch size={21} />
              </button>
              <button className="text-cream-muted hover:text-primary transition-colors duration-300 cursor-pointer hidden sm:block">
                <FiHeart size={21} />
              </button>
              <button className="text-cream-muted hover:text-primary transition-colors duration-300 cursor-pointer relative">
                <FiShoppingBag size={21} />
                <span className="absolute -top-1.5 -right-2 w-4.5 h-4.5 bg-primary text-dark text-[10px] font-bold rounded-full flex items-center justify-center">
                  2
                </span>
              </button>
              <button className="text-cream-muted hover:text-primary transition-colors duration-300 cursor-pointer hidden sm:block">
                <FiUser size={21} />
              </button>

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
            className="fixed inset-0 z-40 bg-dark/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 lg:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="text-cream text-[22px] font-ui tracking-[0.3em] font-semibold hover:text-primary transition-colors duration-300"
                onClick={() => setMobileOpen(false)}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
