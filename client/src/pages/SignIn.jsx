import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import toast from 'react-hot-toast'
import AuthImageSlider from '../components/auth/AuthImageSlider'
import AuthFormInput from '../components/auth/AuthFormInput'
import AuthButton from '../components/auth/AuthButton'
import AuthSocialSection from '../components/auth/AuthSocialSection'
import { authServices } from '../api'
import { setToken } from '../components/common/Services'
import { useAuth } from '../context/AuthContext'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    title: 'Elevate Your\nWardrobe Today.',
    subtitle: 'Experience the pinnacle of fashion with tailored recommendations and exclusive collections.',
  },
  {
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop',
    title: 'Discover New\nCollections.',
    subtitle: 'Explore curated styles handpicked by our fashion experts for every season.',
  },
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
    title: 'Style Meets\nComfort.',
    subtitle: 'Premium quality meets everyday comfort. Dress to impress, effortlessly.',
  },
]

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const from = location.state?.from?.pathname

  // ====== Submit → signin, then redirect by ROLE (admin → dashboard, user → home)
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!formData.email) return setErrors('Email is required.')
    if (!formData.password) return setErrors('Password is required.')

    try {
      setLoading(true)
      const res = await authServices.signIn(formData)
      if (res?.token) setToken(res.token) // store for cross-host Authorization header
      const profile = await authServices.getProfile()
      const user = profile?.user || null
      login(user)
      toast.success(res?.message || 'Signed in', { duration: 4000, position: 'top-center' })

      const role = user?.role || res?.role
      setTimeout(() => {
        if (role === 'admin' || role === 'editor') navigate('/admin', { replace: true })
        else navigate(from || '/', { replace: true })
      }, 1200)
    } catch (err) {
      console.log(err)
      const msg = err?.response?.data?.message || 'Sign in failed'
      // Not verified yet → send them to the OTP page
      if (msg.toLowerCase().includes('verify')) {
        toast.error(msg, { position: 'top-center' })
        setTimeout(() => navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`), 1200)
        return
      }
      setErrors(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[1060px] bg-dark-secondary/70 backdrop-blur-2xl rounded-[32px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col md:flex-row border border-dark-border">
      {/* LEFT: image slider */}
      <AuthImageSlider slides={slides} minHeight="620px" />

      {/* RIGHT: form */}
      <div className="w-full md:w-[54%] p-8 sm:p-10 lg:px-14 lg:py-12 flex flex-col justify-center">
        {/* Mobile top bar */}
        <div className="flex md:hidden justify-between items-center mb-8">
          <Link to="/" className="text-cream text-lg font-display font-bold tracking-tight">KAZIR NATION</Link>
          <Link to="/" className="text-[11px] font-ui font-semibold text-cream-muted uppercase tracking-wider hover:text-primary transition-colors">← Back</Link>
        </div>

        <div className="max-w-[360px] mx-auto w-full">
          <div className="mb-8">
            <span className="text-[10px] font-ui tracking-[0.3em] text-primary uppercase font-semibold">Admin & Members</span>
            <h1 className="text-editorial text-[clamp(2rem,3.4vw,2.6rem)] text-cream tracking-tight mt-2 mb-2">Welcome Back</h1>
            <p className="text-[14px] text-cream-muted font-body leading-relaxed">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-primary-light font-semibold transition-colors underline underline-offset-4 decoration-primary/40">Sign up</Link>
            </p>
          </div>

          {errors && (
            <p className="text-[13px] bg-red-500/10 border border-red-500/30 rounded-[8px] text-center text-red-400 font-body py-2 mb-3">{errors}</p>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <AuthFormInput
              label="Email Address" type="email" placeholder="you@example.com" name="email" value={formData.email}
              onChange={(e) => { setFormData((p) => ({ ...p, email: e.target.value })); setErrors('') }}
            />
            <AuthFormInput
              label="Password" type="password" placeholder="Enter your password" name="password" value={formData.password}
              onChange={(e) => { setFormData((p) => ({ ...p, password: e.target.value })); setErrors('') }}
            />

            <div className="flex justify-between items-center pt-0.5">
              <div className="flex items-center gap-2.5">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-dark-border cursor-pointer accent-primary" />
                <label htmlFor="remember" className="text-[12px] text-cream-muted font-body cursor-pointer">Remember me</label>
              </div>
              <Link to="#" className="text-[12px] font-ui font-semibold text-primary hover:text-primary-light transition-colors">Forgot Password?</Link>
            </div>

            <div className="pt-2">
              <AuthButton text={loading ? 'Signing in…' : 'Sign In'} disabled={loading} />
            </div>
          </form>

          <AuthSocialSection dividerText="Or continue with" />
        </div>
      </div>
    </div>
  )
}

export default SignIn
