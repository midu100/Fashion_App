import React from 'react'
import { FiArrowRight } from 'react-icons/fi'
import ProductCard from './common/ProductCard'
import productJacket from '../assets/images/product_jacket.png'
import productPants from '../assets/images/product_pants.png'
import productTank from '../assets/images/product_tank.png'
import productCargo from '../assets/images/product_cargo.png'

const products = [
  {
    id: 1,
    name: 'LEATHER BIKER JACKET',
    price: '199.00',
    oldPrice: '249.00',
    discount: '20% OFF',
    image: productJacket,
    hoverImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'WIDE LEG TAILORED PANTS',
    price: '89.00',
    oldPrice: '119.00',
    discount: 'SPECIAL',
    image: productPants,
    hoverImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'CASHMERE RIBBED TANK TOP',
    price: '49.00',
    image: productTank,
    hoverImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'RELAXED NOIR CARGO PANTS',
    price: '109.00',
    oldPrice: '139.00',
    discount: 'HOT 15%',
    image: productCargo,
    hoverImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=800&auto=format&fit=crop',
  },
]

const FeaturedProducts = () => {
  return (
    <section id="featured" className="relative py-20 md:py-28 px-6 md:px-16 bg-dark">
      <div className="max-w-[1400px] w-full mx-auto">
        {/* ====== Section Header ====== */}
        <div
          className="flex items-center justify-between mb-12 md:mb-16"
          data-aos="fade-up"
        >
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-display font-bold text-cream tracking-tight">
              Featured Products
            </h2>
            <div className="w-12 h-[2px] bg-primary mt-3" />
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-[11px] font-ui tracking-[0.2em] text-cream-muted hover:text-primary transition-colors duration-300 group cursor-pointer"
          >
            VIEW ALL
            <FiArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </a>
        </div>

        {/* ====== Products Grid ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map((product, i) => (
            <div key={product.id} data-aos="fade-up" data-aos-delay={i * 100}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
