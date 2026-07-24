import React from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMinus, FiPlus, FiX, FiArrowRight, FiShoppingBag, FiArrowLeft } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'

const SHIPPING_THRESHOLD = 300

const Cart = () => {
  const navigate = useNavigate()
  const { items, updateQty, removeFromCart, subtotal, cartCount, clearCart } = useCart()

  const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 25
  const total = subtotal + shipping
  const remainingForFree = Math.max(0, SHIPPING_THRESHOLD - subtotal)

  // ====== Empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark text-cream flex flex-col items-center justify-center gap-6 px-6 pt-[85px]">
        <div className="w-16 h-16 rounded-full border border-dark-border flex items-center justify-center text-cream-muted">
          <FiShoppingBag size={26} />
        </div>
        <h2 className="text-editorial text-[2rem] text-cream">Your bag is empty</h2>
        <p className="text-[13px] font-body text-cream-muted max-w-sm text-center">
          Looks like you haven’t added anything yet. Explore the latest arrivals and find your next piece.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-primary text-dark px-8 py-4 text-[11px] font-ui tracking-[0.2em] font-semibold rounded-[8px] hover:bg-primary-light transition-colors duration-300 cursor-pointer active:scale-95"
        >
          CONTINUE SHOPPING
          <FiArrowRight size={15} />
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark text-cream pt-[110px] md:pt-[130px] pb-20 px-6 md:px-16">
      <div className="max-w-[1400px] w-full mx-auto">
        {/* ====== Header ====== */}
        <div className="flex items-end justify-between mb-10 border-b border-dark-border pb-6">
          <div>
            <span className="text-[10px] font-ui tracking-[0.3em] text-primary block mb-2 uppercase font-medium">
              YOUR SELECTION
            </span>
            <h1 className="text-editorial text-[clamp(2rem,4vw,3rem)] text-cream">Shopping Bag</h1>
          </div>
          <span className="text-[13px] font-body text-cream-muted">{cartCount} item{cartCount > 1 ? 's' : ''}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ====== Left: Line items ====== */}
          <div className="lg:col-span-8">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-5 py-6 border-b border-dark-border"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${item.slug}`}
                    className="w-24 h-32 md:w-28 md:h-36 shrink-0 rounded-[12px] overflow-hidden bg-dark-card border border-dark-border"
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          to={`/product/${item.slug}`}
                          className="text-[13px] font-ui tracking-[0.14em] text-cream font-medium hover:text-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                        {item.size && (
                          <p className="text-[12px] font-body text-cream-muted mt-1.5">Size: {item.size}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-cream-muted hover:text-primary transition-colors cursor-pointer p-1"
                      >
                        <FiX size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Qty */}
                      <div className="inline-flex items-center border border-dark-border rounded-[6px]">
                        <button
                          onClick={() => updateQty(item.id, item.size, item.qty - 1)}
                          className="w-9 h-9 flex items-center justify-center text-cream-muted hover:text-primary transition-colors cursor-pointer"
                        >
                          <FiMinus size={13} />
                        </button>
                        <span className="w-9 text-center text-[13px] font-body font-semibold">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.size, item.qty + 1)}
                          className="w-9 h-9 flex items-center justify-center text-cream-muted hover:text-primary transition-colors cursor-pointer"
                        >
                          <FiPlus size={13} />
                        </button>
                      </div>
                      <span className="text-[14px] font-body font-semibold text-cream">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Footer actions */}
            <div className="flex items-center justify-between mt-8">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[11px] font-ui tracking-[0.2em] text-cream-muted hover:text-primary transition-colors cursor-pointer"
              >
                <FiArrowLeft size={14} />
                CONTINUE SHOPPING
              </Link>
              <button
                onClick={clearCart}
                className="text-[11px] font-ui tracking-[0.2em] text-cream-muted hover:text-red-400 transition-colors cursor-pointer"
              >
                CLEAR BAG
              </button>
            </div>
          </div>

          {/* ====== Right: Summary ====== */}
          <div className="lg:col-span-4 lg:sticky lg:top-[120px]">
            <div className="bg-dark-card border border-dark-border rounded-[16px] p-7">
              <h3 className="text-[13px] font-ui tracking-[0.2em] text-cream font-semibold uppercase mb-6">
                Order Summary
              </h3>

              {/* Free shipping progress */}
              {remainingForFree > 0 ? (
                <p className="text-[12px] font-body text-cream-muted mb-2">
                  Add <span className="text-primary font-semibold">{formatPrice(remainingForFree)}</span> more for free shipping
                </p>
              ) : (
                <p className="text-[12px] font-body text-primary mb-2">You’ve unlocked free shipping ✦</p>
              )}
              <div className="w-full h-1.5 bg-dark-border rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>

              <div className="space-y-3 pb-5 border-b border-dark-border">
                <div className="flex items-center justify-between text-[13px] font-body">
                  <span className="text-cream-muted">Subtotal</span>
                  <span className="text-cream font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-[13px] font-body">
                  <span className="text-cream-muted">Shipping</span>
                  <span className="text-cream font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-5">
                <span className="text-[13px] font-ui tracking-[0.15em] text-cream font-semibold uppercase">Total</span>
                <span className="text-[20px] font-body font-bold text-cream">{formatPrice(total)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-primary text-dark text-[12px] font-ui tracking-[0.2em] font-semibold rounded-[8px] flex items-center justify-center gap-2 hover:bg-primary-light transition-colors duration-300 cursor-pointer active:scale-[0.98]"
              >
                PROCEED TO CHECKOUT
                <FiArrowRight size={15} />
              </button>

              <p className="text-[11px] font-body text-cream-muted/60 text-center mt-4">
                Secure checkout • Taxes calculated at next step
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
