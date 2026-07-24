import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import toast from 'react-hot-toast'
import AuthImageSlider from '../components/auth/AuthImageSlider'
import AuthButton from '../components/auth/AuthButton'
import AuthOtpInput from '../components/auth/AuthOtpInput'
import { authServices } from '../api'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop',
    title: 'Almost\nThere!',
    subtitle: 'Just one more step to unlock your account. Verify your email to get started.',
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    title: 'Secure Your\nAccount.',
    subtitle: 'We take your security seriously. Email verification keeps your account safe.',
  },
  {
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop',
    title: 'Welcome to\nThe Family.',
    subtitle: "You're moments away from joining a community that celebrates style and quality.",
  },
]

const VerifyEmail = () => {
  const [otp, setOtp] = useState('')
  const [errors, setErrors] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const navigate = useNavigate()

  // ====== Verify OTP → back to signin
  const handleOtp = async () => {
    if (!otp) return setErrors('OTP is required.')
    try {
      setLoading(true)
      const res = await authServices.verifyOtp({ otp, email })
      toast.success(res?.message || 'Verified', { duration: 4000, position: 'top-center' })
      setTimeout(() => navigate('/signin'), 1500)
    } catch (err) {
      console.log(err)
      setErrors(err?.response?.data?.message || 'Invalid or expired OTP')
    } finally {
      setLoading(false)
    }
  }

  // ====== Resend OTP
  const handleResendOtp = async () => {
    if (!email) return setErrors('Email is missing.')
    try {
      const res = await authServices.resendOtp({ email })
      toast.success(res?.message || 'OTP sent', { duration: 4000, position: 'top-center' })
    } catch (err) {
      console.log(err)
      setErrors(err?.response?.data?.message || 'Something went wrong while resending OTP')
    }
  }

  return (
    <div className="w-full max-w-[1060px] bg-dark-secondary/70 backdrop-blur-2xl rounded-[32px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col md:flex-row border border-dark-border">
      {/* LEFT: image slider */}
      <AuthImageSlider slides={slides} minHeight="620px" />

      {/* RIGHT: verification */}
      <div className="w-full md:w-[54%] p-8 sm:p-10 lg:px-14 lg:py-12 flex flex-col justify-center">
        <div className="flex md:hidden justify-between items-center mb-8">
          <Link to="/" className="text-cream text-lg font-display font-bold tracking-tight">KAZIR NATION</Link>
          <Link to="/" className="text-[11px] font-ui font-semibold text-cream-muted uppercase tracking-wider hover:text-primary transition-colors">← Back</Link>
        </div>

        <div className="max-w-[360px] mx-auto w-full">
          {/* Email icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-primary/25 to-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_8px_30px_rgba(201,169,110,0.15)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="M22 7l-10 6L2 7" />
              </svg>
            </div>
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-editorial text-[clamp(1.9rem,3.2vw,2.4rem)] text-cream tracking-tight mb-2">Verify Your Email</h1>
            <p className="text-[14px] text-cream-muted font-body leading-relaxed">
              We&apos;ve sent a 4-digit verification code to{email ? <span className="text-primary font-semibold"> {email}</span> : ' your email'}. Please enter it below.
            </p>
          </div>

          {errors && <p className="text-[13px] mb-1 rounded-md text-center text-red-400 font-body leading-relaxed">{errors}</p>}

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleOtp() }}>
            <AuthOtpInput length={4} onChange={(e) => { setOtp(e.target.value); setErrors('') }} />

            <div className="text-center flex justify-center items-center gap-2">
              <p className="text-[13px] text-cream-muted font-body">Didn&apos;t receive the code?</p>
              <button type="button" onClick={handleResendOtp} className="text-[13px] text-primary font-semibold hover:text-primary-light transition-colors underline underline-offset-4 decoration-primary/40">
                Resend OTP
              </button>
            </div>

            <div className="pt-1">
              <AuthButton onClick={handleOtp} text={loading ? 'Verifying…' : 'Verify Email'} type="button" disabled={loading} />
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[13px] text-cream-muted font-body">
              Wrong email?{' '}
              <Link to="/signup" className="text-primary hover:text-primary-light font-semibold transition-colors underline underline-offset-4 decoration-primary/40">Go back to Sign Up</Link>
            </p>
          </div>

          <div className="mt-6 flex items-start gap-3 p-4 rounded-[16px] bg-primary/5 border border-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <p className="text-[12px] text-cream-muted font-body leading-relaxed">
              For your security, this code will expire in 2 minutes. If you didn&apos;t request this, you can safely ignore this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
