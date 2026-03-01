'use client'

import { Download, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PwaPrompt() {
  const [isOffline, setIsOffline] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Reaktywność na status sieciowy klienta
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Detekcja wbudowanego promptu do zainstalowania Aplikacji
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    // Instalacja tylko gdy strona pozwala na PWA a uzytkownik wczesniej nie zainstalowal apikacji
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null) // po pomyślnej instalacji zdejmujemy button z domu
    }
  }

  if (!isOffline && !deferredPrompt) return null

  return (
    <div className="fixed bottom-24 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {deferredPrompt && (
        <div className="bg-white dark:bg-zinc-800 shadow-xl border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom-5 pointer-events-auto">
          <div className="p-2 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl">
            <Download className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Zainstaluj AgentSpark
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">Miej aplikację zawsze pod ręką.</p>
          </div>
          <button
            type="button"
            onClick={handleInstallClick}
            className="ml-2 px-3 py-1.5 text-xs font-bold text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors"
          >
            Zainstaluj
          </button>
        </div>
      )}

      {isOffline && (
        <div className="bg-red-50 dark:bg-red-950/30 shadow-xl border border-red-200 dark:border-red-900/50 rounded-2xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom-5 pointer-events-auto text-red-900 dark:text-red-100">
          <WifiOff className="w-5 h-5" />
          <div className="text-sm font-medium">
            Jesteś offline. Zmiany są bezpieczne w pamięci lokalnej.
          </div>
        </div>
      )}
    </div>
  )
}
