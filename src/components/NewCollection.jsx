import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiVolume2, FiVolumeX } from 'react-icons/fi'

const youtubeVideoId = 'JjA5bG1nc_M'

const NewCollection = () => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=${
    isPlaying ? 1 : 0
  }&mute=${
    isMuted ? 1 : 0
  }&loop=1&playlist=${youtubeVideoId}&controls=0&modestbranding=1&rel=0&enablejsapi=1`

  return (
    <section className="relative py-20 md:py-28 px-6 md:px-16 bg-dark overflow-hidden border-b border-dark-border">
      <div className="max-w-[1400px] w-full mx-auto">
        {/* ====== Section header ====== */}
        <div className="flex items-center gap-4 mb-6" data-aos="fade-up">
          <span className="text-[10px] font-ui tracking-[0.3em] text-primary border border-primary/30 px-4 py-1.5 rounded-full font-medium">
            CAMPAIGN FILM
          </span>
        </div>

        <h2
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-[clamp(1.4rem,3vw,2rem)] font-display font-light text-cream mb-10 md:mb-14 max-w-md tracking-tight"
        >
          SPRING / SUMMER 2026 CINEMATIC
        </h2>

        {/* ====== Video Container: Normally Square, Rounded on Hover ====== */}
        <motion.div
          data-aos="fade-up"
          data-aos-delay="200"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          animate={{ borderRadius: isHovering ? '32px' : '0px' }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="relative w-full aspect-[16/9] md:aspect-[16/7] overflow-hidden group border border-dark-border shadow-2xl bg-dark-card"
        >
          {/* ====== YouTube Embedded Iframe ====== */}
          <iframe
            src={embedUrl}
            title="KAZIR NATION Campaign Film"
            className="w-full h-full object-cover border-0 pointer-events-auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {/* ====== Vignette Edges & Subtle Overlay ====== */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 100px rgba(10,10,10,0.5)' }}
          />

          {/* ====== Top Control Bar ====== */}
          <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 bg-dark/70 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-cream hover:border-primary hover:text-primary transition-all duration-300 cursor-pointer shadow-lg"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
            </button>
          </div>

          {/* ====== Bottom Status Pill ====== */}
          <div className="absolute bottom-6 left-6 z-20 hidden sm:flex items-center gap-3 bg-dark/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-ui tracking-wider text-cream">CAMPAIGN FILM • OFFICIAL HD</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default NewCollection
