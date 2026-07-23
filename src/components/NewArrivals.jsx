import React from 'react'
import { FiArrowRight } from 'react-icons/fi'
import ProductCard from './common/ProductCard'
import productJacket from '../assets/images/product_jacket.png'
import productPants from '../assets/images/product_pants.png'
import productTank from '../assets/images/product_tank.png'
import productCargo from '../assets/images/product_cargo.png'

const newArrivalsData = [
  {
    id: 101,
    name: 'OVERSIZED TRENCH COAT',
    price: '249.00',
    oldPrice: '299.00',
    discount: 'NEW 15%',
    image: productJacket,
    hoverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 102,
    name: 'TAILORED MONOCHROME TROUSER',
    price: '119.00',
    image: productPants,
    hoverImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 103,
    name: 'STRUCTURED KNIT VEST',
    price: '79.00',
    oldPrice: '99.00',
    discount: 'LIMITED',
    image: productTank,
    hoverImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 104,
    name: 'TACTICAL CARGO SHIRT',
    price: '139.00',
    image: productCargo,
    hoverImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=800&auto=format&fit=crop',
  },
]

const NewArrivals = () => {
  return (
    <section id="new-arrivals" className="relative py-20 md:py-28 px-6 md:px-16 bg-dark border-b border-dark-border">
      <div className="max-w-[1400px] w-full mx-auto">
        {/* ====== Section Header ====== */}
        <div className="flex items-center justify-between mb-12 md:mb-16" data-aos="fade-up">
          <div>
            <span className="text-[10px] font-ui tracking-[0.3em] text-primary block mb-2 uppercase font-medium">
              JUST DROPPED
            </span>
            <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-display font-bold text-cream tracking-tight">
              New Arrivals
            </h2>
            <div className="w-12 h-[2px] bg-primary mt-3" />
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-[11px] font-ui tracking-[0.2em] text-cream-muted hover:text-primary transition-colors duration-300 group cursor-pointer"
          >
            VIEW ALL NEW
            <FiArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </a>
        </div>

        {/* ====== Product Grid ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {newArrivalsData.map((product, i) => (
            <div key={product.id} data-aos="fade-up" data-aos-delay={i * 100}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewArrivals
