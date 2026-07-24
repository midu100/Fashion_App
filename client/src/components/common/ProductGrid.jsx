import React from 'react'
import ProductCard from './ProductCard'

// ====== Reusable Product Grid (renders any product array with AOS stagger) ======
const ProductGrid = ({ products = [] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
      {products.map((product, i) => (
        <div key={product.id} data-aos="fade-up" data-aos-delay={i * 100}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

export default ProductGrid
