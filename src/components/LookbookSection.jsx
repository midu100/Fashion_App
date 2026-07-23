import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import collectionImg from '../assets/images/collection.png'
import heroImg from '../assets/images/hero.png'

const lookbookItems = [
  {
    id: '01',
    tag: 'LOOKBOOK 2026',
    titleLine1: 'BEYOND',
    titleLine2: 'THE ORDINARY',
    description: 'A curated selection of looks that define our approach to modern elegance.',
    cta: 'EXPLORE LOOKBOOK',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: '02',
    tag: 'AUTUMN SILHOUETTES',
    titleLine1: 'MINIMAL',
    titleLine2: 'EXPRESSION',
    description: 'Understated luxury defined by structured tailoring and monochrome tones.',
    cta: 'DISCOVER LOOKS',
    image: collectionImg,
  },
  {
    id: '03',
    tag: 'NOIR ARCHIVE',
    titleLine1: 'TIMELESS',
    titleLine2: 'STRUCTURE',
    description: 'Crafted for daily confidence with premium weight fabrics and refined cuts.',
    cta: 'VIEW CATALOG',
    image: heroImg,
  },
]

const LookbookSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const current = lookbookItems[currentIndex]

  return (
    <section className="relative py-20 md:py-28 px-6 md:px-16 bg-dark overflow-hidden border-b border-dark-border">
      <div className="max-w-[1400px] w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ====== Left Column: Editorial Photo with Group Hover ====== */}
          <div className="group relative aspect-[4/4.5] overflow-hidden rounded-[2px] bg-dark-card border border-dark-border group-hover:border-primary/50 transition-colors duration-500 shadow-2xl cursor-pointer">
            <AnimatePresence mode="wait">
              <motion.img
                key={current.id}
                src={current.image}
                alt={current.titleLine1}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-108"
              />
            </AnimatePresence>

            {/* Dark Overlay & Shimmer on Hover */}
            <div className="absolute inset-0 bg-dark/20 group-hover:bg-dark/10 transition-colors duration-500" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer-gold pointer-events-none" />
          </div>

          {/* ====== Right Column: Content & Manual Slider ====== */}
          <div className="flex flex-col justify-between py-2">
            <div className="relative flex justify-between items-start gap-6">
              {/* Text Block */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="space-y-6 max-w-lg"
                >
                  <span className="text-[10px] md:text-[11px] font-ui tracking-[0.3em] text-primary block uppercase font-semibold">
                    {current.tag}
                  </span>

                  <h2 className="text-editorial text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.9] text-cream">
                    <span className="block">{current.titleLine1}</span>
                    <span className="block italic text-primary">{current.titleLine2}</span>
                  </h2>

                  <p className="text-[13px] md:text-[14px] font-body text-cream-muted leading-relaxed max-w-md">
                    {current.description}
                  </p>

                  <div className="pt-4">
                    <a
                      href="#"
                      className="inline-flex items-center gap-4 border border-cream/40 px-7 py-3.5 text-[11px] font-ui tracking-[0.2em] font-semibold text-cream hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 group/btn cursor-pointer"
                    >
                      {current.cta}
                      <FiArrowRight
                        size={14}
                        className="group-hover/btn:translate-x-1.5 transition-transform duration-300 text-primary"
                      />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Far Right: Manual Slide Counter (01, 02, 03) */}
              <div className="flex flex-col items-center gap-6 shrink-0 pt-2">
                {lookbookItems.map((item, idx) => {
                  const isActive = currentIndex === idx
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentIndex(idx)}
                      className="flex flex-col items-center gap-2 group cursor-pointer outline-none"
                    >
                      <span
                        className={`text-[13px] font-ui tracking-wider transition-all duration-300 ${
                          isActive
                            ? 'text-cream font-bold scale-110'
                            : 'text-cream-muted/40 group-hover:text-cream'
                        }`}
                      >
                        {item.id}
                      </span>
                      {isActive ? (
                        <motion.div
                          layoutId="lookbookActiveLine"
                          className="w-[1px] h-8 bg-primary"
                        />
                      ) : (
                        <div className="w-[1px] h-3 bg-dark-border group-hover:bg-cream-muted/50 transition-colors" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LookbookSection
