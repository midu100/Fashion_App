import React from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

const stats = [
  { value: '2019', label: 'Founded in Dhaka' },
  { value: '40+', label: 'Archive pieces' },
  { value: '12k+', label: 'Customers worldwide' },
  { value: '100%', label: 'Considered materials' },
]

const values = [
  { title: 'Considered design', text: 'Every silhouette earns its place — restrained, versatile, built to outlast trends.' },
  { title: 'Premium materials', text: 'Italian wool blends, grade-A cashmere and structured cottons, chosen to age well.' },
  { title: 'Made to last', text: 'Fewer, better pieces. We design against disposability, not for it.' },
]

const About = () => {
  return (
    <div className="min-h-screen bg-dark text-cream">
      {/* ====== Hero ====== */}
      <section className="relative pt-[150px] md:pt-[190px] pb-20 px-6 md:px-16 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] rounded-full blur-[160px] opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle,#C9A96E,transparent 70%)' }} />
        <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] font-ui tracking-[0.35em] text-primary uppercase relative">Our Story</motion.span>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-editorial text-[clamp(2.6rem,7vw,5.5rem)] leading-[1] mt-4 relative">
          Dressing the <span className="italic text-primary">modern minimalist.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[15px] md:text-[16px] font-body text-cream-muted max-w-2xl mx-auto mt-7 leading-relaxed relative">
          KAZIR NATION is a Bangladeshi fashion house building an archive of timeless, premium essentials —
          for people who value how something is made as much as how it looks.
        </motion.p>
      </section>

      {/* ====== Image + story ====== */}
      <section className="px-6 md:px-16 pb-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative aspect-[4/5] rounded-[22px] overflow-hidden border border-dark-border">
            <img src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1000&auto=format&fit=crop" alt="Atelier" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-editorial text-[clamp(1.9rem,4vw,3rem)] leading-[1.1] mb-6">Built on restraint,<br />not excess.</h2>
            <p className="text-[15px] font-body text-cream-muted leading-relaxed mb-5">
              We started with a simple frustration: too much fast fashion, too little that lasts. So we set out to make
              a small, deliberate collection — cut cleanly, finished properly, and priced honestly.
            </p>
            <p className="text-[15px] font-body text-cream-muted leading-relaxed">
              Every drop is designed to layer with the last. Nothing is meant to be thrown away next season.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ====== Stats ====== */}
      <section className="border-y border-dark-border py-16 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-editorial text-[clamp(2rem,4vw,3.2rem)] text-primary">{s.value}</p>
              <p className="text-[12px] font-ui tracking-[0.15em] text-cream-muted uppercase mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== Values ====== */}
      <section className="px-6 md:px-16 py-24">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-editorial text-[clamp(1.8rem,4vw,3rem)] text-center mb-14">What we stand for</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-dark-secondary border border-dark-border rounded-[18px] p-8 hover:border-primary/40 transition-colors"
              >
                <span className="text-[13px] font-ui text-primary font-bold">0{i + 1}</span>
                <h3 className="text-[19px] font-display font-semibold text-cream mt-3 mb-3">{v.title}</h3>
                <p className="text-[14px] font-body text-cream-muted leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="border-t border-dark-border py-20 px-6 text-center">
        <h2 className="text-editorial text-[clamp(2rem,5vw,3.4rem)]">Wear the difference.</h2>
        <p className="text-[14px] font-body text-cream-muted mt-3 mb-8">Explore the collection that started it all.</p>
        <Link to="/shop" className="group inline-flex items-center gap-2.5 bg-primary text-dark px-8 py-3.5 text-[11px] font-ui tracking-[0.2em] font-semibold rounded-full hover:bg-primary-light transition-all cursor-pointer active:scale-95">
          SHOP NOW
          <FiArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </div>
  )
}

export default About
