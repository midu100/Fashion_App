import React from 'react'

// ====== Social provider button — KAZIR NATION dark theme ======
const SocialButton = ({ provider, icon, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-[10px] border border-dark-border bg-dark-card px-6 py-3.5 text-[13px] font-ui font-semibold text-cream transition-all hover:border-primary/50 hover:bg-dark-card/60 active:scale-[0.98] outline-none cursor-pointer"
      style={{ boxSizing: 'border-box' }}
    >
      {icon}
      <span>{provider}</span>
    </button>
  )
}

export default SocialButton
