'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        className: 'rounded-xl border border-white/10 shadow-xl backdrop-blur-xl',
        style: {
          background: 'var(--bg-card, rgba(30, 30, 30, 0.8))',
          color: 'var(--text-main, #ffffff)',
        },
      }}
      closeButton
      richColors
      expand={true}
    />
  )
}
