import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'

// ====== Left image slider (auto-fade) — from the full-stack repo ======
const AuthImageSlider = ({ slides = [], minHeight = '620px' }) => {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => setActive((p) => (p + 1) % slides.length), 4000)
    return () => clearInterval(t)
  }, [slides.length])

  return (
    <div className="hidden md:block md:w-[46%] relative bg-black rounded-[26px] m-3 overflow-hidden" style={{ minHeight }}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-[800ms] ease-in-out"
          style={{ opacity: index === active ? 1 : 0 }}
        >
          <img src={slide.image} alt={slide.title.replace('\n', ' ')} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 px-7 pt-6 flex justify-between items-center z-10">
            <Link to="/" className="text-white/90 text-lg font-black tracking-tight">KAZIR NATION</Link>
            <Link
              to="/"
              className="text-[10px] font-semibold text-white/80 uppercase tracking-wider hover:text-white px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 transition-all hover:bg-white/20 flex items-center gap-1.5"
            >
              Back to website
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {/* Bottom text */}
          <div className="absolute bottom-14 left-8 right-8 text-white z-10">
            <h2 className="text-3xl font-black mb-3 leading-tight tracking-tight whitespace-pre-line">{slide.title}</h2>
            <p className="text-white/55 font-medium text-[13px] leading-relaxed max-w-[280px]">{slide.subtitle}</p>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-7 left-8 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === active ? 'w-8 bg-primary' : 'w-6 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  )
}

export default AuthImageSlider
