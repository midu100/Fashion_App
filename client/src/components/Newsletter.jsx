import React, { useState } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { newsletterServices } from '../api'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // ====== Form Handler → POST /newsletter/subscribe ======
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    try {
      setLoading(true)
      const res = await newsletterServices.subscribe({ email })
      setSubmitted(true)
      toast.success(res?.message || 'Subscribed', { position: 'top-center' })
      setTimeout(() => {
        setEmail('')
        setSubmitted(false)
      }, 3000)
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message || 'Could not subscribe', { position: 'top-center' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative py-20 md:py-28 px-6 md:px-16 bg-dark-secondary border-t border-b border-dark-border overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* ====== Left Column: Text ====== */}
        <div className="max-w-xl" data-aos="fade-right">
          <span className="text-[10px] font-ui tracking-[0.3em] text-primary mb-3 block">
            NEWSLETTER
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-display font-bold text-cream tracking-tight mb-4">
            STAY IN THE LOOP
          </h2>
          <p className="text-[14px] font-body text-cream-muted leading-relaxed">
            Get exclusive access to new arrivals, special offers, lookbooks, and style inspiration directly to your inbox.
          </p>
        </div>

        {/* ====== Right Column: Form ====== */}
        <div className="w-full md:w-auto min-w-[320px] md:min-w-[420px]" data-aos="fade-left">
          {submitted ? (
            <div className="bg-dark-card border border-primary/40 rounded-[2px] p-4 text-center">
              <p className="text-primary text-[12px] font-ui tracking-[0.2em]">
                THANK YOU FOR SUBSCRIBING
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-card border border-dark-border border-r-0 text-cream placeholder:text-cream-muted/50 px-5 py-4 text-[13px] font-body outline-none focus:border-primary transition-colors duration-300"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-light text-dark px-6 py-4 transition-colors duration-300 cursor-pointer flex items-center justify-center active:scale-95 shrink-0 disabled:opacity-60"
              >
                <FiArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default Newsletter
