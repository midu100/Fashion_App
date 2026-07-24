import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import AuthImageSlider from '../components/auth/AuthImageSlider'
import AuthFormInput from '../components/auth/AuthFormInput'
import AuthButton from '../components/auth/AuthButton'
import AuthSocialSection from '../components/auth/AuthSocialSection'
import { authServices } from '../api'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
    title: 'Capturing Moments,\nCreating Memories',
    subtitle: 'Create your account and unlock faster checkout, exclusive deals, and personalized recommendations.',
  },
  {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop',
    title: 'Join The\nCommunity.',
    subtitle: 'Be part of a community that celebrates style, quality, and sustainable fashion.',
  },
  {
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop',
    title: 'Your Style,\nYour Story.',
    subtitle: 'Express yourself with curated collections designed for the modern trendsetter.',
  },
]

const SignUp = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '', address: '' })
  const [errors, setErrors] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const setField = (key) => (e) => { setFormData((p) => ({ ...p, [key]: e.target.value })); setErrors('') }

  // ====== Submit → signup, then go verify the email (OTP)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.fullName) return setErrors('Full name is required.')
    if (!formData.email) return setErrors('Email is required.')
    if (!formData.password) return setErrors('Password is required.')

    try {
      setLoading(true)
      const res = await authServices.signUp(formData)
      toast.success(res?.message || 'Account created', { duration: 4000, position: 'top-center' })
      setTimeout(() => navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`), 1500)
    } catch (err) {
      console.log(err)
      setErrors(err?.response?.data?.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[1060px] bg-dark-secondary/70 backdrop-blur-2xl rounded-[32px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col md:flex-row border border-dark-border">
      {/* LEFT: image slider */}
      <AuthImageSlider slides={slides} minHeight="740px" />

      {/* RIGHT: form */}
      <div className="w-full md:w-[54%] p-8 sm:p-10 lg:px-14 lg:py-10 flex flex-col justify-center">
        {/* Mobile top bar */}
        <div className="flex md:hidden justify-between items-center mb-6">
          <Link to="/" className="text-cream text-lg font-display font-bold tracking-tight">KAZIR NATION</Link>
          <Link to="/" className="text-[11px] font-ui font-semibold text-cream-muted uppercase tracking-wider hover:text-primary transition-colors">← Back</Link>
        </div>

        <div className="max-w-[360px] mx-auto w-full">
          <div className="mb-6">
            <span className="text-[10px] font-ui tracking-[0.3em] text-primary uppercase font-semibold">Join The Nation</span>
            <h1 className="text-editorial text-[clamp(1.9rem,3.2vw,2.4rem)] text-cream tracking-tight mt-2 mb-2">Create an account</h1>
            <p className="text-[14px] text-cream-muted font-body leading-relaxed">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:text-primary-light font-semibold transition-colors underline underline-offset-4 decoration-primary/40">Log in</Link>
            </p>
          </div>

          {errors && (
            <p className="text-[13px] bg-red-500/10 border border-red-500/30 rounded-[8px] text-center text-red-400 font-body py-2 mb-3">{errors}</p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <AuthFormInput label="Full Name" type="text" placeholder="John Doe" name="fullName" value={formData.fullName} onChange={setField('fullName')} />
            <AuthFormInput label="Email Address" type="email" placeholder="you@example.com" name="email" value={formData.email} onChange={setField('email')} />

            <div className="grid grid-cols-2 gap-3">
              <AuthFormInput label="Password" type="password" placeholder="Enter your password" name="password" value={formData.password} onChange={setField('password')} />
              <AuthFormInput label="Phone" type="tel" placeholder="+880 1XXX..." name="phone" value={formData.phone} onChange={setField('phone')} />
            </div>
            <AuthFormInput label="Address" type="text" placeholder="Dhaka, BD" name="address" value={formData.address} onChange={setField('address')} />

            <div className="flex items-start gap-3 pt-0.5">
              <div className="flex items-center h-5 mt-0.5">
                <input type="checkbox" id="terms" className="w-4 h-4 rounded border-dark-border cursor-pointer accent-primary" />
              </div>
              <label htmlFor="terms" className="text-[12px] text-cream-muted leading-relaxed cursor-pointer font-body">
                I agree to the{' '}
                <Link to="#" className="text-primary hover:text-primary-light font-semibold transition-colors underline underline-offset-2 decoration-primary/40">Terms &amp; Conditions</Link>
              </label>
            </div>

            <div className="pt-1.5">
              <AuthButton text={loading ? 'Creating…' : 'Create account'} disabled={loading} />
            </div>
          </form>

          <AuthSocialSection dividerText="Or register with" />
        </div>
      </div>
    </div>
  )
}

export default SignUp
