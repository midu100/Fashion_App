import React, { createContext, useContext, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ====== Fly-to-Cart Context ======
// Animates a product image from its origin into the cart icon, then bumps it.
const FlyToCartContext = createContext(null)

const FLY_W = 84
const FLY_H = 104
export const CART_TARGET_ID = 'kn-cart-icon' // Navbar tags its bag icon with this id

export const FlyToCartProvider = ({ children }) => {
  const idRef = useRef(0)
  const [flights, setFlights] = useState([])
  const [bump, setBump] = useState(0)

  // ====== Launch a flight from a source rect to the cart icon
  const flyToCart = useCallback((image, fromRect) => {
    const targetEl = document.getElementById(CART_TARGET_ID)
    if (!targetEl || !fromRect) return

    const target = targetEl.getBoundingClientRect()
    const from = { x: fromRect.left + fromRect.width / 2, y: fromRect.top + fromRect.height / 2 }
    const to = { x: target.left + target.width / 2, y: target.top + target.height / 2 }

    const id = ++idRef.current
    setFlights((prev) => [...prev, { id, image, from, to }])
  }, [])

  const handleDone = useCallback((id) => {
    setFlights((prev) => prev.filter((f) => f.id !== id))
    setBump((b) => b + 1)
  }, [])

  return (
    <FlyToCartContext.Provider value={{ flyToCart, bump }}>
      {children}

      {/* ====== Flying overlay layer (above navbar, non-interactive) ====== */}
      <div className="fixed inset-0 z-[100] pointer-events-none">
        <AnimatePresence>
          {flights.map((f) => {
            const midX = (f.from.x + f.to.x) / 2
            const arcY = Math.min(f.from.y, f.to.y) - 130
            return (
              <motion.img
                key={f.id}
                src={f.image}
                alt=""
                initial={{ x: f.from.x - FLY_W / 2, y: f.from.y - FLY_H / 2, scale: 1, opacity: 1, rotate: 0 }}
                animate={{
                  x: [f.from.x - FLY_W / 2, midX - FLY_W / 2, f.to.x - FLY_W / 2],
                  y: [f.from.y - FLY_H / 2, arcY - FLY_H / 2, f.to.y - FLY_H / 2],
                  scale: [1, 0.74, 0.18],
                  opacity: [1, 1, 0.9],
                  rotate: [0, -8, 6],
                }}
                transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1], times: [0, 0.45, 1] }}
                onAnimationComplete={() => handleDone(f.id)}
                className="fixed left-0 top-0 object-cover rounded-[14px] border border-primary/50 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)]"
                style={{ width: FLY_W, height: FLY_H, willChange: 'transform' }}
              />
            )
          })}
        </AnimatePresence>
      </div>
    </FlyToCartContext.Provider>
  )
}

// ====== Hook
export const useFlyToCart = () => {
  const ctx = useContext(FlyToCartContext)
  if (!ctx) throw new Error('useFlyToCart must be used within a FlyToCartProvider')
  return ctx
}
