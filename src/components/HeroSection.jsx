import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiPlay, FiPause } from 'react-icons/fi'
import heroImg from '../assets/images/hero.png'
import collectionImg from '../assets/images/collection.png'
import productCargo from '../assets/images/product_cargo.png'

const slideData = [
  {
    id: '01',
    label: 'LEGACY COLLECTION',
    tag: 'SS/26',
    titleLines: ['DEFINE', 'YOUR', 'OWN'],
    highlight: 'LEGACY',
    ctaPrimary: 'DISCOVER COLLECTION',
    ctaSecondary: 'EXPLORE LOOKBOOK',
    image: heroImg,
  },
  {
    id: '02',
    label: 'SUMMER ESSENTIALS',
    tag: 'EDITORIAL EXCLUSIVES',
    titleLines: ['THE NEW', 'STANDARD OF'],
    highlight: 'ELEGANCE',
    ctaPrimary: 'EXPLORE NOW',
    ctaSecondary: 'VIEW LOOKBOOK',
    image: collectionImg,
  },
  {
    id: '03',
    label: 'NOIR SERIES',
    tag: 'LIMITED ARCHIVE',
    titleLines: ['NOIR', 'MINIMALIST'],
    highlight: 'TAILORING',
    ctaPrimary: 'VIEW CATALOG',
    ctaSecondary: 'SEE DETAILS',
    image: productCargo,
  },
]

const fashionVideoUrl = 'https://videos.pexels.com/video-files/4620563/4620563-sd_960_506_25fps.mp4'

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isVideoMode, setIsVideoMode] = useState(false)
  const videoRef = useRef(null)

  // ====== Auto-rotate slides (only when NOT in video mode)
  useEffect(() => {
    if (isVideoMode) return
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideData.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [isVideoMode])

  const toggleVideo = () => {
    setIsVideoMode((prev) => !prev)
  }

  const current = slideData[activeSlide]

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[640px] overflow-hidden bg-dark select-none"
    >
      {/* ====== Video Background ====== */}
      <AnimatePresence>
        {isVideoMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-[1] w-full h-full"
          >
            <video
              ref={videoRef}
              src={fashionVideoUrl}
              crossOrigin="anonymous"
              preload="auto"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-dark/40" />
            <div className="absolute inset-0 gradient-dark-bottom" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== Image Background Slider ====== */}
      {!isVideoMode && (
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={current.image}
              alt={current.highlight}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-dark/50" />
            <div className="absolute inset-0 gradient-dark-bottom" />
          </motion.div>
        </AnimatePresence>
      )}

      {/* ====== Noise texture ====== */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-[2]" />

      {/* ====== Main Content ====== */}
      <div className="relative z-10 h-full w-full max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col justify-between pt-[80px] md:pt-[90px] pb-10 md:pb-14">
        {/* ====== Top: Content Block ====== */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={isVideoMode ? 'video' : current.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="space-y-5"
            >
              {/* ====== Tag ====== */}
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-[10px] md:text-[11px] font-ui tracking-[0.35em] text-cream-muted font-medium"
              >
                {current.tag}
              </motion.p>

              {/* ====== Headline ====== */}
              <div className="overflow-hidden">
                <h1 className="text-editorial text-[clamp(3rem,10vw,8rem)] leading-[0.85] text-cream max-w-[900px]">
                  {current.titleLines.map((line, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ y: 80, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.25 + idx * 0.1,
                        duration: 0.7,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className="block"
                    >
                      {line}
                    </motion.span>
                  ))}
                  <motion.span
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.25 + current.titleLines.length * 0.1,
                      duration: 0.7,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="italic text-primary block"
                  >
                    {current.highlight}
                  </motion.span>
                </h1>
              </div>

              {/* ====== CTA Button ====== */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="pt-4"
              >
                <a
                  href="#featured"
                  className="inline-flex items-center gap-3 group cursor-pointer w-fit"
                >
                  <span className="text-ui text-[11px] md:text-[12px] text-cream tracking-[0.2em] group-hover:text-primary transition-colors duration-300">
                    {current.ctaPrimary}
                  </span>
                  <span className="w-8 h-8 border border-cream-muted rounded-full flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-dark transition-all duration-300">
                    <FiArrowRight size={14} />
                  </span>
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ====== Bottom Bar ====== */}
        <div className="flex items-end justify-between">
          {/* ====== Left: Slide Counter ====== */}
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-ui tracking-wider text-cream font-bold">
              {String(activeSlide + 1).padStart(2, '0')}
            </span>
            <div className="relative w-16 h-[2px] bg-dark-border overflow-hidden rounded-full">
              <motion.div
                key={activeSlide}
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                animate={{ scaleX: 1 }}
                transition={{ duration: isVideoMode ? 0 : 6, ease: 'linear' }}
                className="absolute inset-0 bg-primary"
              />
            </div>
            <span className="text-[12px] font-ui tracking-wider text-cream-muted/50">
              {String(slideData.length).padStart(2, '0')}
            </span>
          </div>

          {/* ====== Center: Play Showreel ====== */}
          <button
            onClick={toggleVideo}
            className="flex items-center gap-3 group cursor-pointer outline-none"
          >
            <span className="w-10 h-10 border border-cream/40 rounded-full flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
              {isVideoMode ? (
                <FiPause size={14} className="text-cream group-hover:text-primary transition-colors" />
              ) : (
                <FiPlay size={14} className="text-cream ml-0.5 group-hover:text-primary transition-colors" />
              )}
            </span>
            <div className="hidden sm:block text-left">
              <span className="text-[9px] font-ui tracking-[0.2em] text-cream-muted block leading-tight">
                {isVideoMode ? 'STOP' : 'PLAY'}
              </span>
              <span className="text-[10px] font-ui tracking-[0.15em] text-cream font-medium block leading-tight">
                SHOWREEL
              </span>
            </div>
          </button>

          {/* ====== Right: Scroll Down ====== */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-ui tracking-[0.2em] text-cream-muted hidden sm:block">
              SCROLL DOWN
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="w-[1px] h-5 bg-gradient-to-b from-primary to-transparent"
            />
          </div>
        </div>
      </div>

      {/* ====== Right Side Dot Controls ====== */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {slideData.map((slide, i) => {
          const isActive = activeSlide === i
          return (
            <button
              key={slide.id}
              onClick={() => {
                setActiveSlide(i)
                setIsVideoMode(false)
              }}
              className="outline-none cursor-pointer p-1"
            >
              <div
                className={`rounded-full transition-all duration-400 ${
                  isActive
                    ? 'w-3 h-3 bg-cream shadow-[0_0_8px_rgba(245,240,235,0.5)]'
                    : 'w-2 h-2 bg-cream-muted/40 hover:bg-cream-muted/70'
                }`}
              />
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default HeroSection
