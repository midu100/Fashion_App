import React from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

// Editorial imagery (Unsplash) — varying spans for a magazine masonry feel
const shots = [
  { img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop', label: 'The Noir Edit', span: 'row-span-2' },
  { img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop', label: 'Tailored Lines' },
  { img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=900&auto=format&fit=crop', label: 'Street Formal' },
  { img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=900&auto=format&fit=crop', label: 'Layered Neutrals', span: 'row-span-2' },
  { img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=900&auto=format&fit=crop', label: 'Monochrome' },
  { img: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=900&auto=format&fit=crop', label: 'Archive Series' },
]

const Lookbook = () => {
  return (
    <div className="min-h-screen bg-dark text-cream">
      {/* ====== Hero ====== */}
      <section className="pt-[130px] md:pt-[160px] pb-16 px-6 md:px-16 text-center">
        <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] font-ui tracking-[0.35em] text-primary uppercase">
          SS/26 · The Lookbook
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-editorial text-[clamp(2.6rem,7vw,5.5rem)] leading-[1] mt-4">
          Worn, not <span className="italic text-primary">styled.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[14px] md:text-[15px] font-body text-cream-muted max-w-xl mx-auto mt-6 leading-relaxed">
          A season captured in motion — archive-grade tailoring photographed the way it lives.
        </motion.p>
      </section>

      {/* ====== Masonry grid ====== */}
      <section className="px-6 md:px-16 pb-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-3 auto-rows-[240px] md:auto-rows-[300px] gap-4 md:gap-6">
          {shots.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
              className={`group relative overflow-hidden rounded-[18px] border border-dark-border ${s.span || ''}`}
            >
              <img src={s.img} alt={s.label} className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-[11px] font-ui tracking-[0.25em] text-primary uppercase mb-1">Look {String(i + 1).padStart(2, '0')}</p>
                <h3 className="text-[18px] md:text-[22px] font-display font-semibold text-cream">{s.label}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====== CTA band ====== */}
      <section className="border-t border-dark-border py-20 px-6 text-center">
        <h2 className="text-editorial text-[clamp(1.8rem,4vw,3rem)] text-cream">Shop the looks</h2>
        <p className="text-[14px] font-body text-cream-muted mt-3 mb-8">Every piece from the editorial, ready to wear.</p>
        <Link to="/shop" className="group inline-flex items-center gap-2.5 bg-primary text-dark px-8 py-3.5 text-[11px] font-ui tracking-[0.2em] font-semibold rounded-full hover:bg-primary-light transition-all cursor-pointer active:scale-95">
          EXPLORE THE COLLECTION
          <FiArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </div>
  )
}

export default Lookbook
