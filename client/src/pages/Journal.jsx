import React from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'

const featured = {
  category: 'Editorial',
  title: 'The Quiet Power of a Well-Cut Coat',
  excerpt: 'Why the trench remains the single most versatile piece in a considered wardrobe — and how to wear it beyond the obvious.',
  date: 'July 2026',
  read: '6 min read',
  img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1400&auto=format&fit=crop',
}

const articles = [
  { category: 'Craft', title: 'Inside the Atelier: How Wool Becomes Structure', excerpt: 'A look at the fabric mills and finishing that define archive-grade tailoring.', date: 'Jun 2026', read: '4 min', img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop' },
  { category: 'Style', title: 'Building a Monochrome Wardrobe', excerpt: 'Fewer pieces, endless combinations — the case for restraint.', date: 'Jun 2026', read: '5 min', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop' },
  { category: 'Culture', title: 'Noir: A Colour Story', excerpt: 'The enduring language of black in modern fashion.', date: 'May 2026', read: '3 min', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop' },
  { category: 'Care', title: 'Make It Last: Caring for Fine Knitwear', excerpt: 'Simple rituals that keep cashmere looking new for years.', date: 'May 2026', read: '4 min', img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop' },
]

const Journal = () => {
  return (
    <div className="min-h-screen bg-dark text-cream pt-[130px] md:pt-[150px] pb-24 px-6 md:px-16">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[10px] font-ui tracking-[0.35em] text-primary uppercase">The Journal</span>
          <h1 className="text-editorial text-[clamp(2.4rem,6vw,4.5rem)] leading-[1] mt-4">Stories & <span className="italic text-primary">style.</span></h1>
          <p className="text-[14px] font-body text-cream-muted max-w-xl mx-auto mt-5">Notes on craft, culture and how to wear it well.</p>
        </div>

        {/* Featured */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-dark-secondary border border-dark-border rounded-[22px] overflow-hidden mb-16"
        >
          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden">
            <img src={featured.img} alt={featured.title} className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
          </div>
          <div className="p-8 lg:p-12">
            <div className="flex items-center gap-3 text-[11px] font-ui tracking-[0.2em] text-primary uppercase mb-4">
              <span>{featured.category}</span><span className="w-1 h-1 rounded-full bg-cream-muted/50" /><span className="text-cream-muted">{featured.read}</span>
            </div>
            <h2 className="text-editorial text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.1] text-cream mb-4">{featured.title}</h2>
            <p className="text-[15px] font-body text-cream-muted leading-relaxed mb-6">{featured.excerpt}</p>
            <span className="inline-flex items-center gap-2 text-[12px] font-ui tracking-[0.2em] text-cream group-hover:text-primary transition-colors">
              READ ARTICLE <FiArrowUpRight size={15} />
            </span>
          </div>
        </motion.article>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((a, i) => (
            <motion.article
              key={a.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] border border-dark-border mb-4">
                <img src={a.img} alt={a.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-colors" />
                <span className="absolute top-3 left-3 text-[9px] font-ui font-bold tracking-[0.15em] text-dark bg-primary rounded-full px-2.5 py-1 uppercase">{a.category}</span>
              </div>
              <p className="text-[11px] font-body text-cream-muted mb-1.5">{a.date} · {a.read}</p>
              <h3 className="text-[15px] font-ui tracking-wide text-cream font-semibold leading-snug group-hover:text-primary transition-colors">{a.title}</h3>
              <p className="text-[12.5px] font-body text-cream-muted mt-2 leading-relaxed line-clamp-2">{a.excerpt}</p>
            </motion.article>
          ))}
        </div>

        {/* Newsletter nudge */}
        <div className="text-center mt-20 pt-14 border-t border-dark-border">
          <h3 className="text-editorial text-[clamp(1.6rem,3vw,2.4rem)] text-cream">Never miss a story</h3>
          <p className="text-[14px] font-body text-cream-muted mt-3 mb-6">Get the Journal & new drops in your inbox.</p>
          <Link to="/#newsletter" className="inline-flex items-center gap-2.5 border border-cream/25 text-cream px-8 py-3.5 text-[11px] font-ui tracking-[0.2em] font-semibold rounded-full hover:border-primary hover:text-primary transition-all cursor-pointer">
            SUBSCRIBE
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Journal
