import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMinus, FiPlus, FiShoppingBag, FiHeart, FiChevronRight, FiChevronUp, FiChevronDown,
  FiTruck, FiRefreshCw, FiShield,
} from 'react-icons/fi'
import { formatPrice } from '../data/products'
import { productServices, mapProduct } from '../api'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useFlyToCart } from '../context/FlyToCartContext'
import ProductCard from '../components/common/ProductCard'
import ProductReviews from '../components/ProductReviews'
import Stars from '../components/common/Stars'

// ====== Vertical smooth-slide gallery (auto-advance + thumbnails + arrows) ======
const VerticalGallery = ({ images, discount, name }) => {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)

  const multi = images.length > 1

  // Slide to a target index, remembering the direction for the animation
  const goTo = (next, dir) => {
    setDirection(dir)
    setIndex((next + images.length) % images.length)
  }

  // ====== Auto-advance vertically (pauses on hover)
  useEffect(() => {
    if (!multi || paused) return
    const t = setInterval(() => {
      setDirection(1)
      setIndex((prev) => (prev + 1) % images.length)
    }, 3500)
    return () => clearInterval(t)
  }, [multi, paused, images.length])

  const variants = {
    enter: (dir) => ({ y: dir > 0 ? '100%' : '-100%', opacity: 0.4 }),
    center: { y: '0%', opacity: 1 },
    exit: (dir) => ({ y: dir > 0 ? '-100%' : '100%', opacity: 0.4 }),
  }

  return (
    <div className="flex gap-4">
      {/* ====== Vertical thumbnails ====== */}
      {multi && (
        <div className="hidden sm:flex flex-col gap-3 shrink-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > index ? 1 : -1)}
              className={`w-16 h-20 rounded-[6px] overflow-hidden border-2 bg-white transition-all duration-300 cursor-pointer ${
                index === i ? 'border-primary' : 'border-black/10 hover:border-black/30'
              }`}
            >
              <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {/* ====== Main sliding stage ====== */}
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative flex-1 aspect-[4/5] bg-white rounded-[8px] overflow-hidden border border-black/5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]"
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={index}
            src={images[index]}
            alt={name}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ y: { type: 'tween', ease: [0.4, 0, 0.2, 1], duration: 0.7 }, opacity: { duration: 0.4 } }}
            className="absolute inset-0 w-full h-full object-contain p-6 will-change-transform"
          />
        </AnimatePresence>

        {discount && (
          <div className="absolute top-5 left-5 z-10 bg-primary text-dark font-ui text-[11px] font-bold tracking-[0.15em] px-3 py-1.5 rounded-full uppercase">
            {discount}
          </div>
        )}

        {/* ====== Up / Down controls ====== */}
        {multi && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
            <button
              onClick={() => goTo(index - 1, -1)}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-black/10 flex items-center justify-center text-dark hover:bg-primary hover:border-primary transition-all duration-300 cursor-pointer shadow-md"
            >
              <FiChevronUp size={18} />
            </button>
            <button
              onClick={() => goTo(index + 1, 1)}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-black/10 flex items-center justify-center text-dark hover:bg-primary hover:border-primary transition-all duration-300 cursor-pointer shadow-md"
            >
              <FiChevronDown size={18} />
            </button>
          </div>
        )}

        {/* ====== Progress dots ====== */}
        {multi && (
          <div className="absolute left-5 bottom-5 z-10 flex flex-col gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  index === i ? 'w-1.5 h-4 bg-dark' : 'w-1.5 h-1.5 bg-dark/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ====== Collapsible info row ======
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-black/10">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
      >
        <span className="text-[13px] font-ui tracking-[0.2em] text-dark font-semibold uppercase group-hover:text-primary-dark transition-colors">
          {title}
        </span>
        <FiChevronDown
          size={19}
          className={`text-dark/60 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-[15px] font-body text-dark/70 leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ProductDetails = () => {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { flyToCart } = useFlyToCart()
  const galleryRef = useRef(null)

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewSummary, setReviewSummary] = useState({ avg: 0, count: 0 })

  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')

  // ====== Fetch product + related when the slug changes
  useEffect(() => {
    setSelectedSize('')
    setQty(1)
    setError('')
    setLoading(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    const load = async () => {
      try {
        const res = await productServices.getProductBySlug(slug)
        const mapped = mapProduct(res?.productDetails)
        setProduct(mapped)

        // Related: same category, different slug
        if (mapped) {
          const listRes = await productServices.getProducts({ limit: 100 })
          const all = (listRes?.productList || []).map(mapProduct)
          setRelated(all.filter((p) => p.slug !== mapped.slug && p.category === mapped.category).slice(0, 4))
        }
      } catch (err) {
        console.log(err)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  // ====== Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <p className="text-[13px] font-ui tracking-[0.3em] text-dark/60 uppercase animate-pulse">Loading…</p>
      </div>
    )
  }

  // ====== Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-5 px-6">
        <h2 className="text-editorial text-[2.4rem] text-dark">Product not found</h2>
        <Link
          to="/shop"
          className="text-[13px] font-ui tracking-[0.2em] text-dark border-b border-primary pb-1 hover:text-primary-dark transition-colors"
        >
          BACK TO SHOP
        </Link>
      </div>
    )
  }

  const gallery = product.gallery?.length ? product.gallery : [product.image]
  const wishlisted = isWishlisted(product.id)
  const details = product.details?.length ? product.details : ['Premium materials', 'Crafted for KAZIR NATION', 'Ships worldwide']

  // ====== Per-size stock (sum variants sharing a size) — for out-of-stock UI
  const sizeStock = {}
  ;(product.variants || []).forEach((v) => { sizeStock[v.size] = (sizeStock[v.size] || 0) + (v.stock || 0) })
  const totalStock = Object.values(sizeStock).reduce((s, n) => s + n, 0)
  const selectedStock = selectedSize ? sizeStock[selectedSize] || 0 : 0

  // ====== Add to cart (guard-clause validation) + fly animation
  const handleAddToCart = () => {
    if (!selectedSize) return setError('Please select a size.')
    const stock = sizeStock[selectedSize] || 0
    if (stock <= 0) return setError('That size is out of stock.')
    if (qty > stock) return setError(`Only ${stock} left in size ${selectedSize}.`)
    addToCart(product, selectedSize, qty)
    if (galleryRef.current) flyToCart(product.image, galleryRef.current.getBoundingClientRect())
  }

  return (
    <div className="w-full bg-cream text-dark">
      {/* ====== Upper: Light editorial product view ====== */}
      <section className="max-w-[1400px] w-full mx-auto px-6 md:px-16 pt-[110px] md:pt-[130px] pb-16 md:pb-24">
        {/* ====== Breadcrumb ====== */}
        <div className="flex items-center gap-2 text-[12px] font-ui tracking-[0.15em] text-dark/50 mb-10">
          <Link to="/" className="hover:text-primary-dark transition-colors">HOME</Link>
          <FiChevronRight size={13} />
          <Link to="/shop" className="hover:text-primary-dark transition-colors">{product.category}</Link>
          <FiChevronRight size={13} />
          <span className="text-dark font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* ====== Left: Name + short desc (like reference) ====== */}
          <div className="lg:col-span-3 lg:sticky lg:top-[120px] order-2 lg:order-1">
            <span className="text-[11px] font-ui tracking-[0.3em] text-primary-dark uppercase font-semibold">
              {product.category}
            </span>
            <h1 className="text-editorial text-[clamp(2.2rem,3.4vw,3.2rem)] leading-[1.02] text-dark mt-3">
              {product.name}
            </h1>
            {reviewSummary.count > 0 && (
              <div className="flex items-center gap-2 mt-4">
                <Stars value={reviewSummary.avg} size={16} />
                <span className="text-[13px] font-body text-dark/60">{reviewSummary.avg.toFixed(1)} · {reviewSummary.count} review{reviewSummary.count !== 1 ? 's' : ''}</span>
              </div>
            )}
            <p className="text-[16px] font-body text-dark/60 leading-relaxed mt-6 max-w-sm">
              {product.description}
            </p>
          </div>

          {/* ====== Center: Vertical sliding gallery ====== */}
          <div ref={galleryRef} className="lg:col-span-6 order-1 lg:order-2">
            <VerticalGallery images={gallery} discount={product.discount} name={product.name} />
          </div>

          {/* ====== Right: Buy panel ====== */}
          <div className="lg:col-span-3 order-3">
            {/* ====== Price ====== */}
            <div className="flex items-end gap-3 mb-1">
              <span className="text-[2rem] font-body font-semibold text-dark">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="text-[17px] font-body text-dark/40 line-through mb-1.5">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            <p className="text-[13px] font-body text-dark/50 mb-7">Tax included. Shipping at checkout.</p>

            {/* ====== Size selector ====== */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-ui tracking-[0.2em] text-dark font-semibold uppercase">Size</span>
                <button className="text-[12px] font-body text-dark/50 underline underline-offset-2 hover:text-primary-dark transition-colors cursor-pointer">
                  Size chart
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => {
                  const out = (sizeStock[size] || 0) <= 0
                  return (
                    <button
                      key={size}
                      disabled={out}
                      onClick={() => {
                        setSelectedSize(size)
                        setError('')
                      }}
                      title={out ? 'Out of stock' : undefined}
                      className={`h-12 rounded-[6px] border text-[13px] font-ui font-semibold transition-all duration-200 relative ${
                        out
                          ? 'border-black/10 text-dark/25 cursor-not-allowed line-through'
                          : selectedSize === size
                          ? 'border-dark bg-dark text-cream cursor-pointer'
                          : 'border-black/15 text-dark hover:border-dark cursor-pointer'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
              {/* Stock hint */}
              {selectedSize && selectedStock > 0 && selectedStock <= 5 && (
                <p className="text-[12px] text-primary-dark font-body mt-2 font-medium">Only {selectedStock} left in size {selectedSize}</p>
              )}
              {totalStock <= 0 && (
                <p className="text-[13px] text-red-500 font-body mt-2 font-semibold uppercase tracking-wide">Sold out</p>
              )}
              {error && <p className="text-[13px] text-red-500 font-body mt-2">{error}</p>}
            </div>

            {/* ====== Quantity ====== */}
            <div className="mb-6">
              <span className="text-[12px] font-ui tracking-[0.2em] text-dark font-semibold uppercase block mb-3">
                Quantity
              </span>
              <div className="inline-flex items-center border border-black/15 rounded-[6px]">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-dark hover:text-primary-dark transition-colors cursor-pointer"
                >
                  <FiMinus size={16} />
                </button>
                <span className="w-12 text-center text-[16px] font-body font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-12 h-12 flex items-center justify-center text-dark hover:text-primary-dark transition-colors cursor-pointer"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* ====== Actions ====== */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={totalStock <= 0}
                className="flex-1 py-4 bg-dark text-cream text-[13px] font-ui tracking-[0.2em] font-semibold rounded-[8px] flex items-center justify-center gap-2 hover:bg-primary hover:text-dark transition-all duration-300 cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-dark disabled:hover:text-cream"
              >
                <FiShoppingBag size={17} />
                {totalStock <= 0 ? 'SOLD OUT' : 'ADD TO CART'}
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-[54px] h-[54px] shrink-0 border rounded-[8px] flex items-center justify-center transition-colors cursor-pointer ${
                  wishlisted
                    ? 'border-primary bg-primary/10 text-primary-dark'
                    : 'border-black/15 text-dark hover:border-dark hover:text-primary-dark'
                }`}
              >
                <FiHeart size={19} className={wishlisted ? 'fill-current' : ''} />
              </button>
            </div>

            {/* ====== Trust row ====== */}
            <div className="grid grid-cols-3 gap-2 mb-8 text-center">
              {[
                { icon: <FiTruck size={17} />, label: 'Free shipping' },
                { icon: <FiRefreshCw size={17} />, label: '30-day returns' },
                { icon: <FiShield size={17} />, label: 'Authenticity' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 py-2">
                  <span className="text-primary-dark">{item.icon}</span>
                  <span className="text-[11px] font-body text-dark/60">{item.label}</span>
                </div>
              ))}
            </div>

            {/* ====== Accordions ====== */}
            <div>
              <Accordion title="Product Details" defaultOpen>
                <ul className="space-y-1.5 list-disc list-inside">
                  {details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Care Instructions">
                Follow the fabric care label. Store on a padded hanger, away from direct sunlight. Professional cleaning preserves the finish.
              </Accordion>
              <Accordion title="Shipping & Returns">
                Complimentary worldwide shipping on all orders. Free returns within 30 days of delivery — items must be unworn with tags attached.
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* ====== Reviews (light) ====== */}
      <ProductReviews productId={product.id} onSummary={setReviewSummary} />

      {/* ====== Lower: Related products (dark band, reuses ProductCard) ====== */}
      {related.length > 0 && (
        <section className="bg-dark text-cream py-20 md:py-24 px-6 md:px-16">
          <div className="max-w-[1400px] w-full mx-auto">
            <div className="mb-12">
              <span className="text-[10px] font-ui tracking-[0.3em] text-primary block mb-2 uppercase font-medium">
                YOU MAY ALSO LIKE
              </span>
              <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-display font-bold text-cream tracking-tight">
                Complete the Look
              </h2>
              <div className="w-12 h-[2px] bg-primary mt-3" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default ProductDetails
