import React from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiX, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useFlyToCart } from '../context/FlyToCartContext'
import { formatPrice } from '../data/products'

const Wishlist = () => {
  const { items, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist()
  const { addToCart } = useCart()
  const { flyToCart } = useFlyToCart()

  // ====== Move a wishlist item into the cart (fly, then remove)
  const handleMoveToCart = (e, product) => {
    const img = e.currentTarget.closest('.group')?.querySelector('img')
    if (img) flyToCart(product.image, img.getBoundingClientRect())
    addToCart(product, product?.sizes?.[0] || null, 1)
    removeFromWishlist(product.id)
  }

  // ====== Empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark text-cream flex flex-col items-center justify-center gap-6 px-6 pt-[85px]">
        <div className="w-16 h-16 rounded-full border border-dark-border flex items-center justify-center text-cream-muted">
          <FiHeart size={26} />
        </div>
        <h2 className="text-editorial text-[2rem] text-cream">Your wishlist is empty</h2>
        <p className="text-[13px] font-body text-cream-muted max-w-sm text-center">
          Save the pieces you love by tapping the heart. They’ll be waiting for you right here.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-3 bg-primary text-dark px-8 py-4 text-[11px] font-ui tracking-[0.2em] font-semibold rounded-[8px] hover:bg-primary-light transition-colors duration-300 cursor-pointer active:scale-95"
        >
          EXPLORE THE COLLECTION
          <FiArrowRight size={15} />
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark text-cream pt-[110px] md:pt-[130px] pb-24 px-6 md:px-16">
      <div className="max-w-[1400px] w-full mx-auto">
        {/* ====== Header ====== */}
        <div className="flex items-end justify-between mb-10 border-b border-dark-border pb-6">
          <div>
            <span className="text-[10px] font-ui tracking-[0.3em] text-primary block mb-2 uppercase font-medium">
              SAVED FOR LATER
            </span>
            <h1 className="text-editorial text-[clamp(2rem,4vw,3rem)] text-cream">Wishlist</h1>
          </div>
          <button
            onClick={clearWishlist}
            className="text-[11px] font-ui tracking-[0.2em] text-cream-muted hover:text-red-400 transition-colors cursor-pointer"
          >
            CLEAR ALL ({wishlistCount})
          </button>
        </div>

        {/* ====== Grid ====== */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
          <AnimatePresence>
            {items.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                className="group"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-dark-card rounded-[20px] mb-4 border border-dark-border group-hover:border-primary/40 transition-colors duration-500 shadow-lg">
                  {product.discount && (
                    <div className="absolute top-4 -left-7 -rotate-45 z-20 bg-primary text-dark font-ui text-[9px] font-extrabold tracking-[0.15em] px-8 py-1 shadow-xl uppercase pointer-events-none">
                      {product.discount}
                    </div>
                  )}

                  <Link to={`/product/${product.slug}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </Link>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 z-20 w-9 h-9 bg-dark/60 backdrop-blur-md rounded-full flex items-center justify-center text-cream hover:bg-red-500 hover:text-cream transition-all duration-300 cursor-pointer hover:scale-110"
                  >
                    <FiX size={16} />
                  </button>

                  {/* Move to cart */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out z-20">
                    <button
                      onClick={(e) => handleMoveToCart(e, product)}
                      className="w-full py-3 bg-cream/95 text-dark text-[10px] font-ui tracking-[0.22em] font-semibold rounded-[12px] hover:bg-primary transition-colors duration-300 cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      <FiShoppingBag size={13} />
                      MOVE TO CART
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1 px-1">
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-[12px] font-ui tracking-[0.16em] text-cream group-hover:text-primary transition-colors duration-300 font-medium block"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-body font-semibold text-cream-muted">{formatPrice(product.price)}</p>
                    {product.oldPrice && (
                      <p className="text-[12px] font-body text-cream-muted/50 line-through">
                        {formatPrice(product.oldPrice)}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Wishlist
