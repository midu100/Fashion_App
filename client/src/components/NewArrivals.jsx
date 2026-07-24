import React, { useState, useEffect } from 'react'
import SectionHeader from './common/SectionHeader'
import ProductGrid from './common/ProductGrid'
import { productServices, mapProduct } from '../api'

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)

  // ====== Newest 4 products from the API
  useEffect(() => {
    const load = async () => {
      try {
        const res = await productServices.getProducts({ limit: 4 })
        setNewArrivals((res?.productList || []).map(mapProduct))
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section id="new-arrivals" className="relative py-20 md:py-28 px-6 md:px-16 bg-dark border-b border-dark-border">
      <div className="max-w-[1400px] w-full mx-auto">
        <SectionHeader
          label="JUST DROPPED"
          title="New Arrivals"
          linkText="VIEW ALL NEW"
          linkTo="/shop"
        />
        {loading ? (
          <p className="text-center py-16 text-[13px] font-ui tracking-[0.2em] text-cream-muted uppercase animate-pulse">Loading…</p>
        ) : (
          <ProductGrid products={newArrivals} />
        )}
      </div>
    </section>
  )
}

export default NewArrivals
