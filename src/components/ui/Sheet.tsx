'use client'

import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'

interface SheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function Sheet({ isOpen, onClose, children, title }: SheetProps) {
  // Zablokuj scrollowanie html/body gdy sheet otwarty
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Kontekst okna wysuwany z dołu - max do 90% DVH (korzysta tez z safe-area-inset-bottom) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              // Swipe-to-dismiss threshold
              if (offset.y > 100 || velocity.y > 500) {
                onClose()
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Opcje z dołu'}
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col max-h-[90dvh] bg-gray-900 border-t border-white/10 rounded-t-3xl shadow-2xl safe-area-bottom pb-4"
          >
            {/* Handle do przeciągnięcia */}
            <div className="w-full h-8 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            <div className="px-6 pb-6 overflow-y-auto w-full max-w-lg mx-auto scrollbar-hide">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
