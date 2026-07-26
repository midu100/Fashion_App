import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import heroPoster from '../assets/images/hero.png'

// Hosted on Cloudinary + auto-optimized (q_auto,w_1280) → fast, no 29MB in the build
const heroVideo = 'https://res.cloudinary.com/dg5hunz2h/video/upload/q_auto:eco,w_1280/v1785059952/hero/kazir-hero.mp4'

// ====== Rotating editorial statements (kept short & clean) ======
const slides = [
  {
    id: '01',
    eyebrow: 'SS/26 · Legacy Collection',
    title: 'Define your own',
    highlight: 'legacy',
    sub: 'Archive-grade essentials, tailored in premium fabrics for the modern minimalist.',
  },
  {
    id: '02',
    eyebrow: 'Editorial Exclusives',
    title: 'The new standard of',
    highlight: 'elegance',
    sub: 'Considered silhouettes designed to move effortlessly from day to night.',
  },
  {
    id: '03',
    eyebrow: 'Limited Archive',
    title: 'Noir minimalist',
    highlight: 'tailoring',
    sub: 'Timeless pieces in a restrained palette — made to last.',
  },
]

const HeroSection = () => {
  const [active, setActive] = useState(0)
  const videoRef = useRef(null)
  const sectionRef = useRef(null)

  // ====== Subtle scroll-out: gentle fade only (NO zoom) ======
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const bgOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.4])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.7
  }, [])

  // ====== Seamless loop — restart from 0 without any zoom/jump (belt & suspenders for mobile)
  const handleEnded = (e) => {
    e.currentTarget.currentTime = 0
    e.currentTarget.play().catch(() => {})
  }

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % slides.length), 6500)
    return () => clearInterval(t)
  }, [])

  const current = slides[active]

  return (
    <section ref={sectionRef} id="hero" className="relative w-full h-screen min-h-[600px] overflow-hidden bg-dark select-none">
      {/* ====== Background video (seamless loop, no zoom) + gentle scroll fade ====== */}
      <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 z-[1]">
        <video
          ref={videoRef}
          src={heroVideo}
          poster={heroPoster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onEnded={handleEnded}
          className="w-full h-full object-cover"
        />
        {/* Legibility overlays — clean, no busy blend layers */}
        <div className="absolute inset-0 bg-dark/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-dark/60" />
      </motion.div>

      {/* ====== Subtle grain ====== */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-[2] opacity-50" />

      {/* ====== Centered content ====== */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 h-full w-full max-w-[1000px] mx-auto px-6 flex flex-col items-center justify-center text-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-primary/60" />
              <span className="text-[10px] md:text-[11px] font-ui tracking-[0.35em] text-primary uppercase">{current.eyebrow}</span>
              <span className="w-8 h-px bg-primary/60" />
            </div>

            {/* Headline — calm, balanced, 2 clean lines */}
            <h1 className="text-editorial text-cream leading-[1.02] text-[clamp(2.4rem,6.2vw,5rem)]">
              {current.title}
              <span className="block italic text-primary mt-1">{current.highlight}.</span>
            </h1>

            {/* Subline */}
            <p className="text-[14px] md:text-[15px] font-body text-cream-muted leading-relaxed max-w-xl mt-6">
              {current.sub}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* CTAs (static — don't flicker on slide change) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-9">
          <Link
            to="/shop"
            className="group inline-flex items-center justify-center gap-2.5 bg-primary text-dark px-8 py-3.5 text-[11px] font-ui tracking-[0.2em] font-semibold rounded-full hover:bg-primary-light transition-all duration-300 cursor-pointer active:scale-95"
          >
            SHOP COLLECTION
            <FiArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-8 py-3.5 text-[11px] font-ui tracking-[0.2em] font-semibold rounded-full border border-cream/25 text-cream hover:border-cream/70 hover:bg-cream/5 transition-all duration-300 cursor-pointer"
          >
            NEW ARRIVALS
          </Link>
        </div>
      </motion.div>

      {/* ====== Bottom bar: progress dots + scroll cue ====== */}
      <div className="absolute bottom-8 left-0 right-0 z-20 px-6 md:px-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {slides.map((s, i) => (
            <button key={s.id} onClick={() => setActive(i)} className="cursor-pointer py-2" aria-label={`Slide ${i + 1}`}>
              <span className={`block h-[3px] rounded-full transition-all duration-500 ${i === active ? 'w-8 bg-primary' : 'w-4 bg-cream/25 hover:bg-cream/50'}`} />
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-cream-muted">
          <span className="text-[10px] font-ui tracking-[0.25em] uppercase">Scroll</span>
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="block w-px h-5 bg-gradient-to-b from-primary to-transparent"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
