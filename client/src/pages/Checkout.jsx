import React, { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { FiLock, FiCheck, FiArrowLeft, FiCreditCard, FiTruck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { orderServices, couponServices } from '../api'
import { formatPrice } from '../data/products'

const SHIPPING_THRESHOLD = 300

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart()

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    phone: '',
  })
  const [payment, setPayment] = useState('card')
  const [errors, setErrors] = useState('')
  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  // ====== Coupon
  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState(null) // { code, discount, freeShipping, type, value }
  const [couponMsg, setCouponMsg] = useState('')
  const [applying, setApplying] = useState(false)

  const baseShipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 25
  const shipping = coupon?.freeShipping ? 0 : baseShipping
  const discount = coupon?.discount || 0
  const total = Math.max(0, subtotal - discount + shipping)

  // ====== Apply / remove coupon
  const applyCoupon = async () => {
    if (!couponInput.trim()) return
    try {
      setApplying(true)
      setCouponMsg('')
      const res = await couponServices.validate({ code: couponInput.trim(), subtotal })
      setCoupon({ code: res.code, discount: res.discount, freeShipping: res.freeShipping, type: res.type, value: res.value })
      setCouponMsg(res.message || 'Coupon applied')
    } catch (err) {
      setCoupon(null)
      setCouponMsg(err?.response?.data?.message || 'Invalid coupon')
    } finally {
      setApplying(false)
    }
  }
  const removeCoupon = () => { setCoupon(null); setCouponInput(''); setCouponMsg('') }

  // ====== Controlled input helper
  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))
    setErrors('')
  }

  // ====== Place order (guard-clause validation) → POST /order/place
  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!formData.email) return setErrors('Email is required.')
    if (!formData.firstName || !formData.lastName) return setErrors('Full name is required.')
    if (!formData.address) return setErrors('Shipping address is required.')
    if (!formData.city) return setErrors('City is required.')
    if (!formData.country) return setErrors('Country is required.')
    if (!formData.phone) return setErrors('Phone number is required.')

    const payload = {
      items: items.map((it) => ({
        product: it.id,
        name: it.name,
        image: it.image,
        price: it.price,
        size: it.size,
        qty: it.qty,
      })),
      shippingAddress: { ...formData },
      paymentMethod: payment,
      couponCode: coupon?.code || undefined,
    }

    try {
      setPlacing(true)
      const res = await orderServices.placeOrder(payload)
      setOrderNumber(res?.order?.orderNumber || '')
      setPlaced(true)
      clearCart()
      toast.success(res?.message || 'Order placed', { position: 'top-center' })
    } catch (err) {
      console.log(err)
      setErrors(err?.response?.data?.message || 'Could not place your order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  // ====== Order confirmed screen
  if (placed) {
    return (
      <div className="min-h-screen bg-dark text-cream flex flex-col items-center justify-center gap-6 px-6 pt-[85px] text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-dark"
        >
          <FiCheck size={38} />
        </motion.div>
        <h2 className="text-editorial text-[clamp(2rem,4vw,3rem)] text-cream">Order Confirmed</h2>
        <p className="text-[14px] font-body text-cream-muted max-w-md">
          Thank you, {formData.firstName}. Your order is on its way. A confirmation has been sent to{' '}
          <span className="text-primary">{formData.email}</span>.
        </p>
        {orderNumber && (
          <p className="text-[12px] font-ui tracking-[0.2em] text-cream-muted/70">
            ORDER #{orderNumber}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          {orderNumber && (
            <Link
              to={`/track-order?order=${orderNumber}`}
              className="inline-flex items-center gap-3 bg-primary text-dark px-8 py-4 text-[11px] font-ui tracking-[0.2em] font-semibold rounded-[8px] hover:bg-primary-light transition-colors duration-300 cursor-pointer active:scale-95"
            >
              TRACK ORDER
            </Link>
          )}
          <Link
            to="/"
            className="inline-flex items-center gap-3 border border-dark-border text-cream px-8 py-4 text-[11px] font-ui tracking-[0.2em] font-semibold rounded-[8px] hover:border-primary hover:text-primary transition-colors duration-300 cursor-pointer active:scale-95"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    )
  }

  // ====== Guard: empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark text-cream flex flex-col items-center justify-center gap-6 px-6 pt-[85px]">
        <h2 className="text-editorial text-[2rem] text-cream">Nothing to check out</h2>
        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-primary text-dark px-8 py-4 text-[11px] font-ui tracking-[0.2em] font-semibold rounded-[8px] hover:bg-primary-light transition-colors cursor-pointer active:scale-95"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    )
  }

  const inputClass =
    'w-full bg-dark-card border border-dark-border text-cream placeholder:text-cream-muted/40 px-4 py-3.5 text-[13px] font-body rounded-[8px] outline-none focus:border-primary transition-colors duration-300'

  return (
    <div className="min-h-screen bg-dark text-cream pt-[110px] md:pt-[130px] pb-20 px-6 md:px-16">
      <div className="max-w-[1400px] w-full mx-auto">
        {/* ====== Header ====== */}
        <div className="mb-10 border-b border-dark-border pb-6">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-[11px] font-ui tracking-[0.2em] text-cream-muted hover:text-primary transition-colors mb-4 cursor-pointer"
          >
            <FiArrowLeft size={14} />
            BACK TO BAG
          </Link>
          <h1 className="text-editorial text-[clamp(2rem,4vw,3rem)] text-cream">Checkout</h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ====== Left: Details ====== */}
          <div className="lg:col-span-7 space-y-10">
            {errors && (
              <p className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-[8px] py-3 px-4 text-[13px] font-body text-center">
                {errors}
              </p>
            )}

            {/* Contact */}
            <div>
              <h3 className="text-[12px] font-ui tracking-[0.2em] text-cream font-semibold uppercase mb-5">
                01 — Contact
              </h3>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Shipping */}
            <div>
              <h3 className="text-[12px] font-ui tracking-[0.2em] text-cream font-semibold uppercase mb-5">
                02 — Shipping Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} className={inputClass} />
                <input name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} className={inputClass} />
                <input name="address" placeholder="Street address" value={formData.address} onChange={handleChange} className={`${inputClass} sm:col-span-2`} />
                <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className={inputClass} />
                <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} className={inputClass} />
                <input name="phone" type="tel" placeholder="Phone number" value={formData.phone} onChange={handleChange} className={`${inputClass} sm:col-span-2`} />
              </div>
            </div>

            {/* Payment */}
            <div>
              <h3 className="text-[12px] font-ui tracking-[0.2em] text-cream font-semibold uppercase mb-5">
                03 — Payment
              </h3>
              <div className="space-y-3">
                {[
                  { key: 'card', label: 'Credit / Debit Card', icon: <FiCreditCard size={17} /> },
                  { key: 'cod', label: 'Cash on Delivery', icon: <FiTruck size={17} /> },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setPayment(opt.key)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-[8px] border text-left transition-all duration-200 cursor-pointer ${
                      payment === opt.key ? 'border-primary bg-primary/5' : 'border-dark-border hover:border-cream-muted/40'
                    }`}
                  >
                    <span className={payment === opt.key ? 'text-primary' : 'text-cream-muted'}>{opt.icon}</span>
                    <span className="text-[13px] font-body text-cream flex-1">{opt.label}</span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        payment === opt.key ? 'border-primary' : 'border-cream-muted/40'
                      }`}
                    >
                      {payment === opt.key && <span className="w-2 h-2 rounded-full bg-primary" />}
                    </span>
                  </button>
                ))}
              </div>
              {payment === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <input placeholder="Card number" className={`${inputClass} sm:col-span-2`} />
                  <input placeholder="MM / YY" className={inputClass} />
                  <input placeholder="CVC" className={inputClass} />
                </div>
              )}
            </div>
          </div>

          {/* ====== Right: Order summary ====== */}
          <div className="lg:col-span-5 lg:sticky lg:top-[120px]">
            <div className="bg-dark-card border border-dark-border rounded-[16px] p-7">
              <h3 className="text-[13px] font-ui tracking-[0.2em] text-cream font-semibold uppercase mb-6">
                Your Order
              </h3>

              {/* Items */}
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1 mb-5">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 items-center">
                    <div className="relative w-16 h-20 shrink-0 rounded-[8px] overflow-hidden bg-dark border border-dark-border">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-dark text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-ui tracking-[0.12em] text-cream truncate">{item.name}</p>
                      {item.size && <p className="text-[11px] font-body text-cream-muted mt-1">Size: {item.size}</p>}
                    </div>
                    <span className="text-[13px] font-body font-semibold text-cream shrink-0">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* ====== Coupon ====== */}
              <div className="py-5 border-t border-dark-border">
                {coupon ? (
                  <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-[8px] px-3 py-2.5">
                    <span className="text-[12px] font-ui text-primary tracking-wide">
                      {coupon.code} applied {coupon.freeShipping ? '· free shipping' : `· −${formatPrice(coupon.discount)}`}
                    </span>
                    <button type="button" onClick={removeCoupon} className="text-[11px] font-ui text-cream-muted hover:text-red-400 transition-colors cursor-pointer">Remove</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Discount code"
                      className="flex-1 bg-dark-card border border-dark-border text-cream placeholder:text-cream-muted/40 px-4 py-2.5 text-[13px] font-body rounded-[8px] outline-none focus:border-primary transition-colors uppercase"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={applying || !couponInput.trim()}
                      className="px-5 py-2.5 border border-dark-border text-cream text-[11px] font-ui tracking-[0.15em] rounded-[8px] hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {applying ? '…' : 'APPLY'}
                    </button>
                  </div>
                )}
                {couponMsg && <p className={`text-[11px] font-body mt-2 ${coupon ? 'text-primary' : 'text-red-400'}`}>{couponMsg}</p>}
              </div>

              <div className="space-y-3 py-5 border-t border-dark-border">
                <div className="flex items-center justify-between text-[13px] font-body">
                  <span className="text-cream-muted">Subtotal</span>
                  <span className="text-cream font-medium">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-[13px] font-body">
                    <span className="text-cream-muted">Discount</span>
                    <span className="text-primary font-medium">−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[13px] font-body">
                  <span className="text-cream-muted">Shipping</span>
                  <span className="text-cream font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-5 border-t border-dark-border">
                <span className="text-[13px] font-ui tracking-[0.15em] text-cream font-semibold uppercase">Total</span>
                <span className="text-[20px] font-body font-bold text-cream">{formatPrice(total)}</span>
              </div>

              <button
                type="submit"
                disabled={placing}
                className="w-full py-4 bg-primary text-dark text-[12px] font-ui tracking-[0.2em] font-semibold rounded-[8px] flex items-center justify-center gap-2 hover:bg-primary-light transition-colors duration-300 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FiLock size={14} />
                {placing ? 'PLACING ORDER…' : `PLACE ORDER • ${formatPrice(total)}`}
              </button>

              <p className="text-[11px] font-body text-cream-muted/60 text-center mt-4">
                By placing your order you agree to our Terms & Privacy Policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
