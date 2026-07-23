import React from 'react'
import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'

const ProductCard = ({ product }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group cursor-pointer"
    >
      {/* ====== Rounded Image Container ====== */}
      <div className="relative aspect-[3/4] overflow-hidden bg-dark-card rounded-[20px] mb-4 border border-dark-border group-hover:border-primary/40 transition-colors duration-500 shadow-lg">
        
        {/* ====== Top Left Angled Offer Ribbon ====== */}
        {product?.discount && (
          <div className="absolute top-4 -left-7 -rotate-45 z-20 bg-primary text-dark font-ui text-[9px] font-extrabold tracking-[0.15em] px-8 py-1 shadow-xl uppercase border-b border-dark/30 pointer-events-none">
            {product.discount}
          </div>
        )}

        {/* ====== Primary Image ====== */}
        <img
          src={product?.image}
          alt={product?.name || 'Product'}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            product?.hoverImage
              ? 'group-hover:opacity-0 group-hover:scale-110'
              : 'group-hover:scale-110'
          }`}
        />

        {/* ====== Secondary Hover Image ====== */}
        {product?.hoverImage && (
          <img
            src={product.hoverImage}
            alt={`${product?.name} alternate`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-110 transition-all duration-700 ease-out"
          />
        )}

        {/* ====== Hover overlay ====== */}
        <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-all duration-500" />

        {/* ====== Wishlist button ====== */}
        <button className="absolute top-4 right-4 z-20 w-9 h-9 bg-dark/50 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-dark text-cream cursor-pointer hover:scale-110">
          <FiHeart size={15} />
        </button>

        {/* ====== Quick view ====== */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out z-20">
          <button className="w-full py-3 bg-cream/95 text-dark text-[10px] font-ui tracking-[0.22em] font-semibold rounded-[12px] hover:bg-primary transition-colors duration-300 cursor-pointer active:scale-95 shadow-md">
            QUICK VIEW
          </button>
        </div>
      </div>

      {/* ====== Product info ====== */}
      <div className="space-y-1 px-1">
        <h4 className="text-[12px] font-ui tracking-[0.16em] text-cream group-hover:text-primary transition-colors duration-300 font-medium">
          {product?.name || 'Product Name'}
        </h4>
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-body font-semibold text-cream-muted">
            ${product?.price || '0.00'}
          </p>
          {product?.oldPrice && (
            <p className="text-[12px] font-body text-cream-muted/50 line-through">
              ${product.oldPrice}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
