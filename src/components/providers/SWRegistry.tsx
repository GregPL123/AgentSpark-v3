'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export function SWRegistry() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            // Reagujemy na update'y z backendu (nowy bundle / manifest)
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Mamy nową wersję w tle, gotową do aktywacji po restarcie strony
                    toast('Dostępna nowa wersja', {
                      description: 'Odśwież stronę, aby załadować nowości!',
                      action: {
                        label: 'Odśwież',
                        onClick: () => window.location.reload(),
                      },
                      duration: 10000,
                    })
                  }
                })
              }
            })
          })
          .catch((err) => {
            console.error('Service Worker registration failed:', err)
          })

        // Upewniamy się, że kontroler przejął stery (PWA requirements)
        navigator.serviceWorker.ready.then((reg) => {
          console.log('SW Ready and active on scope:', reg.scope)
        })
      })
    }
  }, [])

  return null
}
