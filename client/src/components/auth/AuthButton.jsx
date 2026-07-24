import React from 'react'

// ====== Gold CTA with a hover light-sweep — KAZIR NATION theme ======
const AuthButton = ({ text, onClick, type = 'submit', icon, disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="relative group flex w-full items-center justify-center gap-3 overflow-hidden rounded-[12px] bg-primary px-6 py-4 text-[12px] font-ui font-semibold text-dark shadow-[0_8px_30px_rgba(201,169,110,0.25)] transition-all duration-300 hover:bg-primary-light hover:shadow-[0_12px_40px_rgba(201,169,110,0.4)] hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed border-0 outline-none cursor-pointer"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Light sweep on hover */}
      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
        <div className="relative h-full w-10 bg-white/30" />
      </div>

      <span className="relative z-10 tracking-[0.2em] uppercase">{text}</span>
      {icon && <span className="relative z-10">{icon}</span>}
    </button>
  )
}

export default AuthButton
