import React from 'react'
import HeroSection from '../components/HeroSection'
import CategoryStrip from '../components/CategoryStrip'
import NewArrivals from '../components/NewArrivals'
import LookbookSection from '../components/LookbookSection'
import NewCollection from '../components/NewCollection'
import FeaturedProducts from '../components/FeaturedProducts'
import Newsletter from '../components/Newsletter'
import InstagramSection from '../components/InstagramSection'

const Home = () => {
  return (
    <div className="w-full bg-dark text-cream">
      {/* ====== 1. Hero Section ====== */}
      <HeroSection />

      {/* ====== 2. Category Strip (4-column image grid) ====== */}
      <CategoryStrip />

      {/* ====== 3. New Arrivals ====== */}
      <NewArrivals />

      {/* ====== 4. Lookbook 2026 (Manual Slider) ====== */}
      <LookbookSection />

      {/* ====== 5. Campaign Film (Hover Rounded Morph) ====== */}
      <NewCollection />

      {/* ====== 6. Featured Products ====== */}
      <FeaturedProducts />

      {/* ====== 7. Newsletter ====== */}
      <Newsletter />

      {/* ====== 8. Instagram Slider ====== */}
      <InstagramSection />
    </div>
  )
}

export default Home
