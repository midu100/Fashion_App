import React, { useState, useRef, useEffect } from 'react'

// ====== 4-box OTP input (auto-advance + paste) — from the full-stack repo ======
const AuthOtpInput = ({ length = 4, onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''))
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (onChange) onChange({ target: { value: newOtp.join('') } })
    if (value && index < length - 1) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').trim()
    if (new RegExp(`^\\d{${length}}$`).test(pasteData)) {
      const digits = pasteData.split('')
      setOtp(digits)
      if (onChange) onChange({ target: { value: pasteData } })
      inputRefs.current[length - 1]?.focus()
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-ui font-semibold text-cream-muted uppercase tracking-widest pl-0.5 block text-center">
        Verification Code
      </label>
      <div className="flex justify-center gap-3 sm:gap-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className={`w-16 h-[72px] text-center text-2xl font-display font-bold text-cream border-2 rounded-[14px] outline-none bg-dark-card transition-all duration-300 ease-out ${
              digit
                ? 'border-primary bg-primary/10 shadow-[0_0_0_3px_rgba(201,169,110,0.12)] scale-[1.02]'
                : 'border-dark-border hover:border-primary/40'
            } focus:border-primary focus:shadow-[0_0_0_4px_rgba(201,169,110,0.15)] focus:scale-105`}
            style={{ caretColor: '#C9A96E' }}
          />
        ))}
      </div>
    </div>
  )
}

export default AuthOtpInput
