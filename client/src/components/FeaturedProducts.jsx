import React, { useState, useEffect } from 'react'
import SectionHeader from './common/SectionHeader'
import ProductGrid from './common/ProductGrid'
import { productServices, mapProduct } from '../api'

const FeaturedProducts = () => {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  // ====== A different slice of the catalog (skips the newest 4)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await productServices.getProducts({ limit: 8 })
        const all = (res?.productList || []).map(mapProduct)
        const slice = all.slice(4, 8)
        setFeatured(slice.length ? slice : all.slice(0, 4))
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section id="featured" className="relative py-20 md:py-28 px-6 md:px-16 bg-dark">
      <div className="max-w-[1400px] w-full mx-auto">
        <SectionHeader title="Featured Products" linkText="VIEW ALL" linkTo="/shop" />
        {loading ? (
          <p className="text-center py-16 text-[13px] font-ui tracking-[0.2em] text-cream-muted uppercase animate-pulse">Loading…</p>
        ) : (
          <ProductGrid products={featured} />
        )}
      </div>
    </section>
  )
}

export default FeaturedProducts
