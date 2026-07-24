import React, { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSliders, FiCheck } from 'react-icons/fi'
import { productServices, mapProduct } from '../api'
import ProductCard from '../components/common/ProductCard'

const sortOptions = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'newest', label: 'Newest First' },
]

const Shop = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCat, setActiveCat] = useState('ALL')
  const [sort, setSort] = useState('featured')
  const [sortOpen, setSortOpen] = useState(false)

  // ====== Load the full catalog once (API returns newest-first)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await productServices.getProducts({ limit: 100 })
        setProducts((res?.productList || []).map(mapProduct))
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Unique categories from the loaded catalog
  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category)))]

  // ====== Filter + sort (memoised; API order = newest first)
  const visible = useMemo(() => {
    let list = activeCat === 'ALL' ? [...products] : products.filter((p) => p.category === activeCat)

    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    // 'newest' & 'featured' keep the server order (newest first)

    return list
  }, [products, activeCat, sort])

  const activeSortLabel = sortOptions.find((s) => s.key === sort)?.label

  return (
    <div className="min-h-screen bg-dark text-cream pt-[110px] md:pt-[130px] pb-24 px-6 md:px-16">
      <div className="max-w-[1400px] w-full mx-auto">
        {/* ====== Header ====== */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[10px] font-ui tracking-[0.3em] text-primary block mb-3 uppercase font-medium">
            THE COLLECTION
          </span>
          <h1 className="text-editorial text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] text-cream">
            Shop All
          </h1>
          <p className="text-[14px] font-body text-cream-muted mt-5 max-w-md mx-auto">
            Archive-grade essentials, tailored in premium fabrics. Curated for the modern minimalist.
          </p>
        </div>

        {/* ====== Filter Bar ====== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10 pb-6 border-b border-dark-border">
          {/* Category chips */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-5 py-2 rounded-full text-[11px] font-ui tracking-[0.15em] font-semibold transition-all duration-300 cursor-pointer border ${
                  activeCat === cat
                    ? 'bg-primary text-dark border-primary'
                    : 'border-dark-border text-cream-muted hover:border-cream-muted/60 hover:text-cream'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort dropdown + count */}
          <div className="flex items-center gap-5">
            <span className="text-[12px] font-body text-cream-muted whitespace-nowrap">
              {visible.length} item{visible.length !== 1 ? 's' : ''}
            </span>
            <div className="relative">
              <button
                onClick={() => setSortOpen((p) => !p)}
                className="inline-flex items-center gap-2.5 border border-dark-border rounded-full px-5 py-2 text-[11px] font-ui tracking-[0.15em] text-cream hover:border-primary transition-colors cursor-pointer"
              >
                <FiSliders size={14} />
                {activeSortLabel}
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setSortOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-12 z-40 w-56 bg-dark-card border border-dark-border rounded-[12px] p-2 shadow-2xl"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setSort(opt.key)
                          setSortOpen(false)
                        }}
                        className="w-full flex items-center justify-between px-4 py-2.5 rounded-[8px] text-[12px] font-body text-cream-muted hover:bg-dark hover:text-cream transition-colors cursor-pointer"
                      >
                        {opt.label}
                        {sort === opt.key && <FiCheck size={14} className="text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ====== Product Grid ====== */}
        {loading ? (
          <div className="py-24 text-center">
            <p className="text-[13px] font-ui tracking-[0.2em] text-cream-muted uppercase animate-pulse">Loading collection…</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="border border-dashed border-dark-border rounded-[16px] py-24 text-center">
            <p className="text-[13px] font-ui tracking-[0.2em] text-cream-muted uppercase">No products found</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {visible.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Shop
