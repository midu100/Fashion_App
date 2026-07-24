import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const testimonials = [
  {
    id: 1,
    quote: 'The tailoring is on another level. Every piece feels like it was cut for me — the drape, the weight, the finish.',
    name: 'Adrian Voss',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=700&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 2,
    quote: 'KAZIR NATION nails quiet luxury. Understated, architectural, and impossibly well made. The bomber is my signature.',
    name: 'Maya Okonkwo',
    role: 'Stylist, VOGUE',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=700&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 3,
    quote: 'From the packaging to the last stitch, it is a complete experience. Exactly what modern luxury should feel like.',
    name: 'Lucas Bennet',
    role: 'Editor, HYPEBEAST',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=700&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 4,
    quote: 'I have never had compliments like this. Bold yet wearable silhouettes, and genuinely museum-grade fabric. Obsessed.',
    name: 'Isabella Chen',
    role: 'Art Curator',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=700&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 5,
    quote: 'Every drop sells out for a reason. The craft is uncompromising and the fit is flawless. My most-worn label by far.',
    name: 'Theo Marchetti',
    role: 'Photographer',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=700&auto=format&fit=crop',
    rating: 5,
  },
]

const AUTOPLAY_MS = 5000

const Testimonials = () => {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const count = testimonials.length

  const paginate = useCallback((dir) => setIndex((prev) => (prev + dir + count) % count), [count])

  // ====== Autoplay (pauses on hover / drag)
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => paginate(1), AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [paused, paginate, index])

  // Relative position of a card to the active one (wrap-around, symmetric)
  const getOffset = (i) => {
    let offset = i - index
    if (offset > count / 2) offset -= count
    if (offset < -count / 2) offset += count
    return offset
  }

  return (
    <section
      className="relative py-20 md:py-24 px-6 md:px-16 bg-dark-secondary border-b border-dark-border overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ====== Animated aurora background ====== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-primary/15 blur-[130px]"
          animate={{ x: [0, 70, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 -right-40 w-[480px] h-[480px] rounded-full bg-primary-dark/15 blur-[130px]"
          animate={{ x: [0, -60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      <div className="relative z-10 max-w-5xl w-full mx-auto">
        {/* ====== Top row: label + counter (like reference) ====== */}
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <div>
            <span className="text-[10px] font-ui tracking-[0.35em] text-primary block mb-1.5 uppercase font-medium">
              THE VERDICT
            </span>
            <h2 className="text-editorial text-[clamp(1.6rem,3.5vw,2.6rem)] text-cream leading-none">
              Worn &amp; Reviewed
            </h2>
          </div>
          <div className="text-[13px] font-ui tracking-[0.25em] text-cream-muted">
            <span className="text-cream font-semibold">{String(index + 1).padStart(2, '0')}</span>
            <span className="text-cream-muted/50">{' / '}{String(count).padStart(2, '0')}</span>
          </div>
        </div>

        {/* ====== Coverflow stage ====== */}
        <div className="relative h-[420px] sm:h-[460px] flex items-center justify-center">
          {testimonials.map((t, i) => {
            const offset = getOffset(i)
            const isActive = offset === 0
            const isSide = Math.abs(offset) === 1

            return (
              <motion.div
                key={t.id}
                animate={{
                  x: `${offset * 56}%`,
                  scale: isActive ? 1 : 0.78,
                  opacity: isActive ? 1 : isSide ? 0.5 : 0,
                  zIndex: isActive ? 30 : isSide ? 20 : 10,
                  filter: isActive ? 'blur(0px)' : 'blur(3px)',
                }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                drag={isActive ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.16}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -80) paginate(1)
                  else if (info.offset.x > 80) paginate(-1)
                }}
                onClick={() => isSide && setIndex(i)}
                style={{ pointerEvents: isActive || isSide ? 'auto' : 'none' }}
                className={`absolute w-[280px] sm:w-[340px] h-[400px] sm:h-[450px] rounded-[28px] overflow-hidden border border-white/10 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] ${
                  isActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                }`}
              >
                {/* Background portrait */}
                <img src={t.image} alt={t.name} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/55 to-dark/10" />

                {/* Active-only stars */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="absolute top-5 left-6 flex items-center gap-1"
                  >
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <FiStar key={s} size={14} className="fill-primary text-primary" />
                    ))}
                  </motion.div>
                )}

                {/* Bottom content */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  {/* Quote only on the active card */}
                  {isActive && (
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={t.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="text-[13.5px] sm:text-[15px] font-display font-light text-cream leading-relaxed mb-4"
                      >
                        “{t.quote}”
                      </motion.p>
                    </AnimatePresence>
                  )}
                  <h3 className="text-editorial text-[1.9rem] sm:text-[2.3rem] leading-none text-cream lowercase">
                    {t.name.split(' ')[0]}
                  </h3>
                  <p className="text-[11px] font-ui tracking-[0.2em] text-primary uppercase mt-2">{t.role}</p>
                </div>
              </motion.div>
            )
          })}

          {/* ====== Side arrows ====== */}
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous"
            className="absolute left-1 sm:left-6 z-40 w-11 h-11 rounded-full bg-dark/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-cream hover:bg-primary hover:text-dark hover:border-primary transition-all duration-300 cursor-pointer shadow-lg"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={() => paginate(1)}
            aria-label="Next"
            className="absolute right-1 sm:right-6 z-40 w-11 h-11 rounded-full bg-dark/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-cream hover:bg-primary hover:text-dark hover:border-primary transition-all duration-300 cursor-pointer shadow-lg"
          >
            <FiChevronRight size={20} />
          </button>
        </div>

        {/* ====== Bottom segmented progress ====== */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to review ${i + 1}`}
              className="cursor-pointer py-2"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-500 ${
                  index === i ? 'w-10 bg-primary' : 'w-5 bg-cream-muted/25 hover:bg-cream-muted/50'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
