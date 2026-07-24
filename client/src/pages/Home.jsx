import React from 'react'
import HeroSection from '../components/HeroSection'
import Marquee from '../components/Marquee'
import CategoryStrip from '../components/CategoryStrip'
import NewArrivals from '../components/NewArrivals'
import LookbookSection from '../components/LookbookSection'
import NewCollection from '../components/NewCollection'
import FeaturedProducts from '../components/FeaturedProducts'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import InstagramSection from '../components/InstagramSection'

const Home = () => {
  return (
    <div className="w-full bg-dark text-cream">
      {/* ====== 1. Hero Section (slow bg video + scroll zoom + slider) ====== */}
      <HeroSection />

      {/* ====== 2. Announcement Marquee ====== */}
      <Marquee />

      {/* ====== 3. Category Strip (4-column image grid) ====== */}
      <CategoryStrip />

      {/* ====== 4. New Arrivals ====== */}
      <NewArrivals />

      {/* ====== 5. Lookbook 2026 (Manual Slider) ====== */}
      <LookbookSection />

      {/* ====== 6. Campaign Film (Hover Rounded Morph) ====== */}
      <NewCollection />

      {/* ====== 7. Featured Products ====== */}
      <FeaturedProducts />

      {/* ====== 8. Testimonials ====== */}
      <Testimonials />

      {/* ====== 9. Newsletter ====== */}
      <Newsletter />

      {/* ====== 10. Instagram Slider ====== */}
      <InstagramSection />
    </div>
  )
}

export default Home
