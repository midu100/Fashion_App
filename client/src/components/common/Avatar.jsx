import React from 'react'

// ====== Avatar — shows the user's picture, or their initial as a fallback ======
const Avatar = ({ src, name = '', size = 36, className = '' }) => {
  const initial = (name || 'U').trim().charAt(0).toUpperCase()
  const dim = { width: size, height: size }

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={dim}
        className={`rounded-full object-cover border border-dark-border ${className}`}
      />
    )
  }

  return (
    <span
      style={{ ...dim, fontSize: size * 0.42 }}
      className={`rounded-full bg-primary/15 text-primary border border-primary/25 flex items-center justify-center font-ui font-semibold ${className}`}
    >
      {initial}
    </span>
  )
}

export default Avatar
