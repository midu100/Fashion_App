import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { FiInstagram, FiChevronLeft, FiChevronRight, FiExternalLink } from 'react-icons/fi'

const instaPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    link: 'https://instagram.com',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    link: 'https://instagram.com',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop',
    link: 'https://instagram.com',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
    link: 'https://instagram.com',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    link: 'https://instagram.com',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop',
    link: 'https://instagram.com',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
    link: 'https://instagram.com',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop',
    link: 'https://instagram.com',
  },
]

const InstagramSection = () => {
  const scrollRef = useRef(null)

  const handleScroll = (direction) => {
    if (!scrollRef.current) return
    const scrollAmount = direction === 'left' ? -320 : 320
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <section className="relative bg-dark-secondary py-16 md:py-20 px-6 md:px-16 border-t border-dark-border">
      <div className="max-w-[1400px] w-full mx-auto">
        {/* ====== Header with Arrow Slider Controls ====== */}
        <div
          className="flex items-center justify-between mb-8 md:mb-10"
          data-aos="fade-up"
        >
          <div className="flex items-center gap-3">
            <FiInstagram size={18} className="text-primary" />
            <span className="text-[11px] font-ui tracking-[0.25em] text-cream uppercase font-semibold">
              FOLLOW US ON INSTAGRAM
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-ui tracking-[0.2em] text-cream-muted hover:text-primary transition-colors duration-300 hidden sm:block"
            >
              @KAZIRNATION
            </a>

            {/* Slider Nav Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                className="w-9 h-9 border border-dark-border rounded-full flex items-center justify-center text-cream-muted hover:border-primary hover:text-primary transition-all duration-300 cursor-pointer"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-9 h-9 border border-dark-border rounded-full flex items-center justify-center text-cream-muted hover:border-primary hover:text-primary transition-all duration-300 cursor-pointer"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ====== Horizontal Slider ====== */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {instaPosts.map((post) => (
            <motion.a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="group relative flex-none w-[220px] sm:w-[250px] aspect-square overflow-hidden rounded-[4px] border border-dark-border bg-dark-card block"
            >
              {/* ====== Image ====== */}
              <img
                src={post.image}
                alt={`Instagram Post ${post.id}`}
                className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* ====== Dark Overlay on Hover ====== */}
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/65 transition-colors duration-400" />

              {/* ====== Instagram Icon Badge (Top Right) ====== */}
              <div className="absolute top-3 right-3 z-10 w-7 h-7 bg-dark/50 backdrop-blur-md rounded-full flex items-center justify-center text-cream/70 group-hover:text-primary group-hover:bg-dark/80 transition-all duration-300 border border-white/10">
                <FiInstagram size={13} />
              </div>

              {/* ====== Hover Redirect Button ====== */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10 p-4 text-center">
                <div className="w-10 h-10 border border-primary/60 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center text-primary mb-2 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
                  <FiExternalLink size={16} />
                </div>
                <span className="text-[10px] font-ui tracking-[0.2em] text-cream font-medium uppercase transform translate-y-3 group-hover:translate-y-0 transition-transform duration-400 delay-75">
                  VIEW ON INSTAGRAM
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default InstagramSection
