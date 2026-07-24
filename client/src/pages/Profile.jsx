import React from 'react'
import { Link } from 'react-router'
import { FiPackage, FiHeart } from 'react-icons/fi'
import ProfileForm from '../components/ProfileForm'

const Profile = () => {
  return (
    <div className="min-h-screen bg-dark text-cream pt-[110px] md:pt-[130px] pb-24 px-6 md:px-16">
      <div className="max-w-[820px] w-full mx-auto">
        {/* ====== Header ====== */}
        <div className="mb-10 border-b border-dark-border pb-6">
          <span className="text-[10px] font-ui tracking-[0.3em] text-primary block mb-3 uppercase font-medium">Your Account</span>
          <h1 className="text-editorial text-[clamp(2rem,4vw,3rem)] text-cream">My Profile</h1>
          <p className="text-[14px] font-body text-cream-muted mt-3">Update your details and upload a profile picture.</p>
        </div>

        {/* ====== Editor ====== */}
        <div className="bg-dark-secondary border border-dark-border rounded-[18px] p-6 md:p-8">
          <ProfileForm />
        </div>

        {/* ====== Quick links ====== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <Link to="/my-orders" className="flex items-center gap-3 bg-dark-secondary border border-dark-border rounded-[14px] px-5 py-4 hover:border-primary/40 transition-colors cursor-pointer">
            <span className="w-10 h-10 rounded-[10px] bg-primary/15 text-primary flex items-center justify-center"><FiPackage size={18} /></span>
            <div>
              <p className="text-[13px] font-ui text-cream font-semibold">My Orders</p>
              <p className="text-[11px] font-body text-cream-muted">Track your orders & status</p>
            </div>
          </Link>
          <Link to="/wishlist" className="flex items-center gap-3 bg-dark-secondary border border-dark-border rounded-[14px] px-5 py-4 hover:border-primary/40 transition-colors cursor-pointer">
            <span className="w-10 h-10 rounded-[10px] bg-primary/15 text-primary flex items-center justify-center"><FiHeart size={18} /></span>
            <div>
              <p className="text-[13px] font-ui text-cream font-semibold">Wishlist</p>
              <p className="text-[11px] font-body text-cream-muted">Your saved pieces</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Profile
