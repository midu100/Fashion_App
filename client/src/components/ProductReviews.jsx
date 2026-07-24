import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import { FiStar } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Stars from './common/Stars'
import { reviewServices } from '../api'
import { useAuth } from '../context/AuthContext'

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '')

// ====== Product reviews — summary + list + auth-gated write form ======
const ProductReviews = ({ productId, onSummary }) => {
  const { isAuthenticated } = useAuth()
  const [reviews, setReviews] = useState([])
  const [avg, setAvg] = useState(0)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    if (!productId) return
    try {
      const res = await reviewServices.getForProduct(productId)
      setReviews(res?.reviews || [])
      setAvg(res?.avgRating || 0)
      setCount(res?.count || 0)
      onSummary?.({ avg: res?.avgRating || 0, count: res?.count || 0 })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [productId, onSummary])

  useEffect(() => { load() }, [load])

  // ====== Submit a review
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) return toast.error('Please pick a rating', { position: 'top-center' })
    try {
      setSubmitting(true)
      const res = await reviewServices.create({ productId, rating, comment })
      toast.success(res?.message || 'Review added', { position: 'top-center' })
      setRating(0)
      setComment('')
      load()
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message || 'Could not submit review', { position: 'top-center' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="max-w-[1400px] w-full mx-auto px-6 md:px-16 pb-20 md:pb-24">
      <div className="border-t border-black/10 pt-14">
        {/* ====== Header + summary ====== */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-ui tracking-[0.3em] text-primary-dark uppercase font-semibold">Reviews</span>
            <h2 className="text-editorial text-[clamp(1.8rem,3vw,2.6rem)] text-dark mt-2">What customers say</h2>
          </div>
          <div className="flex items-center gap-3">
            <Stars value={avg} size={20} />
            <span className="text-[15px] font-body text-dark font-semibold">{avg.toFixed(1)}</span>
            <span className="text-[13px] font-body text-dark/50">({count} review{count !== 1 ? 's' : ''})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ====== Write a review ====== */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[16px] border border-black/10 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.2)] lg:sticky lg:top-[120px]">
              <h3 className="text-[13px] font-ui tracking-[0.2em] text-dark font-semibold uppercase mb-5">Write a review</h3>

              {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Star picker */}
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i)}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(0)}
                        className="cursor-pointer transition-transform hover:scale-110"
                      >
                        <FiStar size={26} className={(hover || rating) >= i ? 'text-primary fill-current' : 'text-black/20'} />
                      </button>
                    ))}
                    {rating > 0 && <span className="text-[13px] font-body text-dark/60 ml-2">{rating}/5</span>}
                  </div>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Share your thoughts on the fit, quality and feel…"
                    className="w-full bg-cream border border-black/15 rounded-[10px] px-4 py-3 text-[14px] font-body text-dark placeholder:text-dark/30 outline-none focus:border-primary transition-colors resize-none"
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-dark text-cream text-[12px] font-ui tracking-[0.2em] font-semibold rounded-[8px] hover:bg-primary hover:text-dark transition-all duration-300 cursor-pointer active:scale-[0.98] disabled:opacity-60"
                  >
                    {submitting ? 'SUBMITTING…' : 'SUBMIT REVIEW'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-[14px] font-body text-dark/60 mb-4">Sign in to share your review.</p>
                  <Link
                    to="/signin"
                    className="inline-block px-6 py-3 bg-dark text-cream text-[11px] font-ui tracking-[0.2em] font-semibold rounded-[8px] hover:bg-primary hover:text-dark transition-all cursor-pointer"
                  >
                    SIGN IN
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ====== Reviews list ====== */}
          <div className="lg:col-span-7">
            {loading ? (
              <p className="text-[13px] font-ui tracking-[0.2em] text-dark/40 uppercase animate-pulse py-10">Loading reviews…</p>
            ) : reviews.length === 0 ? (
              <div className="border border-dashed border-black/15 rounded-[16px] py-16 text-center">
                <p className="text-[14px] font-body text-dark/50">No reviews yet — be the first to review this piece.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {reviews.map((r) => (
                  <div key={r._id} className="border-b border-black/10 pb-5 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-dark text-cream flex items-center justify-center text-[13px] font-ui font-semibold">
                          {(r.name || 'C').charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-[14px] font-ui font-semibold text-dark">{r.name}</p>
                          <p className="text-[11px] font-body text-dark/40">{fmtDate(r.createdAt)}</p>
                        </div>
                      </div>
                      <Stars value={r.rating} size={14} />
                    </div>
                    {r.comment && <p className="text-[14.5px] font-body text-dark/70 leading-relaxed mt-2">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductReviews
