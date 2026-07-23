import React from 'react'
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-dark text-cream-muted pt-16 pb-10 px-6 md:px-16 border-t border-dark-border">
      <div className="max-w-[1400px] w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-dark-border">
          {/* ====== Brand Column ====== */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-[28px] h-[28px] border border-primary flex items-center justify-center">
                <span className="text-primary text-[9px] font-ui tracking-[0.2em] font-semibold">KN</span>
              </div>
              <span className="text-cream text-[14px] font-ui tracking-[0.3em] font-medium">
                KAZIR NATION
              </span>
            </div>
            <p className="text-[13px] font-body leading-relaxed text-cream-muted/80">
              Defining modern luxury with timeless, high-fashion apparel and accessories. Meticulously designed for the modern minimalist.
            </p>
          </div>

          {/* ====== Quick Links ====== */}
          <div>
            <h4 className="text-[11px] font-ui tracking-[0.2em] text-cream mb-5">SHOP</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><a href="#" className="hover:text-primary transition-colors duration-300">Men's Collection</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-300">Women's Apparel</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-300">Footwear & Boots</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-300">Leather Accessories</a></li>
            </ul>
          </div>

          {/* ====== Information ====== */}
          <div>
            <h4 className="text-[11px] font-ui tracking-[0.2em] text-cream mb-5">CUSTOMER CARE</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><a href="#" className="hover:text-primary transition-colors duration-300">FAQ & Support</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-300">Shipping & Delivery</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-300">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-300">Size Guide</a></li>
            </ul>
          </div>

          {/* ====== Social / Legal ====== */}
          <div>
            <h4 className="text-[11px] font-ui tracking-[0.2em] text-cream mb-5">CONNECT</h4>
            <div className="flex items-center gap-4 mb-6">
              <a href="#" className="w-9 h-9 border border-dark-border rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-colors duration-300">
                <FiInstagram size={15} />
              </a>
              <a href="#" className="w-9 h-9 border border-dark-border rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-colors duration-300">
                <FiFacebook size={15} />
              </a>
              <a href="#" className="w-9 h-9 border border-dark-border rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-colors duration-300">
                <FiTwitter size={15} />
              </a>
            </div>
            <p className="text-[12px] text-cream-muted/60">
              HQ: 104 Fashion Avenue, NY
            </p>
          </div>
        </div>

        {/* ====== Bottom Copyright ====== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[11px] font-ui tracking-wider text-cream-muted/60">
          <p>© 2026 KAZIR NATION. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hover:text-primary transition-colors">TERMS OF SERVICE</a>
            <a href="#" className="hover:text-primary transition-colors">COOKIES</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
