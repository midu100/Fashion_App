import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

// ====== Labeled dark input (password toggle) — KAZIR NATION theme ======
const AuthFormInput = ({ label, type = 'text', placeholder = '', name = '', value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-ui font-semibold text-cream-muted uppercase tracking-widest pl-0.5">{label}</label>
      <div className="relative">
        <input
          value={value}
          onChange={onChange}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          name={name}
          placeholder={placeholder}
          className={`w-full border border-dark-border bg-dark-card rounded-[10px] px-5 py-3.5 text-[14px] font-body outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(201,169,110,0.12)] transition-all placeholder:text-cream-muted/40 text-cream ${isPassword ? 'pr-12' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-cream-muted/60 hover:text-primary transition-colors cursor-pointer"
          >
            {showPassword ? <FaEyeSlash size={17} /> : <FaEye size={17} />}
          </button>
        )}
      </div>
    </div>
  )
}

export default AuthFormInput
