import React from 'react'
import { Link } from 'react-router'
import { FiArrowRight } from 'react-icons/fi'

// ====== Reusable Section Header (label + title + underline + optional link) ======
const SectionHeader = ({ label, title, linkText, linkTo = '#' }) => {
  return (
    <div className="flex items-center justify-between mb-12 md:mb-16" data-aos="fade-up">
      <div>
        {label && (
          <span className="text-[10px] font-ui tracking-[0.3em] text-primary block mb-2 uppercase font-medium">
            {label}
          </span>
        )}
        <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-display font-bold text-cream tracking-tight">
          {title}
        </h2>
        <div className="w-12 h-[2px] bg-primary mt-3" />
      </div>

      {linkText && (
        <Link
          to={linkTo}
          className="inline-flex items-center gap-2 text-[11px] font-ui tracking-[0.2em] text-cream-muted hover:text-primary transition-colors duration-300 group cursor-pointer"
        >
          {linkText}
          <FiArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </Link>
      )}
    </div>
  )
}

export default SectionHeader
