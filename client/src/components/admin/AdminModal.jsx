import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'

// ====== Reusable admin modal / dialog ======
const AdminModal = ({ open, onClose, title, subtitle, children, maxWidth = 'max-w-lg' }) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto bg-dark-secondary border border-dark-border rounded-[20px] shadow-2xl`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-dark-border sticky top-0 bg-dark-secondary z-10">
              <div>
                <h3 className="text-[16px] font-ui tracking-wide text-cream font-semibold">{title}</h3>
                {subtitle && <p className="text-[12px] font-body text-cream-muted mt-1">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-[10px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-primary hover:border-primary transition-colors cursor-pointer shrink-0"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AdminModal
