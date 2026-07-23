import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

const categories = [
  {
    name: 'MEN',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
    link: '#',
  },
  {
    name: 'WOMEN',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
    link: '#',
  },
  {
    name: 'FOOTWEAR',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
    link: '#',
  },
  {
    name: 'ACCESSORIES',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
    link: '#',
  },
]

const CategoryStrip = () => {
  return (
    <section className="relative bg-dark py-0 overflow-hidden border-b border-dark-border">
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <a
              key={cat.name}
              href={cat.link}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="group relative block min-h-[440px] md:min-h-[540px] overflow-hidden border-r border-dark-border last:border-r-0 border-b sm:border-b-0 cursor-pointer"
            >
              {/* ====== Background Image (Always Visible) ====== */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* ====== Dark Gradient Overlay ====== */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/40 to-transparent group-hover:from-dark/90 transition-all duration-500" />

              {/* ====== Content at Bottom Left ====== */}
              <div className="absolute bottom-8 left-8 right-8 z-10 space-y-3">
                <h3 className="text-[clamp(1.6rem,3vw,2.4rem)] font-display font-medium text-cream tracking-wide group-hover:text-primary transition-colors duration-300">
                  {cat.name}
                </h3>

                <div className="inline-flex items-center gap-3 text-cream-muted text-[11px] font-ui tracking-[0.25em] group-hover:text-cream transition-colors duration-300">
                  <span className="border-b border-cream-muted/50 group-hover:border-primary pb-0.5 transition-colors duration-300">
                    SHOP NOW
                  </span>
                  <FiArrowRight
                    size={14}
                    className="transform group-hover:translate-x-1.5 transition-transform duration-300 text-primary"
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryStrip
