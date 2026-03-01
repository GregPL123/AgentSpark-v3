'use client'

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import type * as React from 'react'
import { useLongPress } from 'use-long-press'

// Main layout provider
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  )
}

// Osobny malutki element dla buttona resetującego - wykorzystany będzie w Header
export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme()

  // Wciśnięcie i przetrzymanie 1s = reset do systemowych
  const bindLongPress = useLongPress(() => setTheme('system'), { threshold: 1000 })

  return (
    <button
      {...bindLongPress()}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 ring-blue-500 transition-transform active:scale-95 touch-manipulation"
      aria-label="Zmień motyw. Przytrzymaj dłużej by przywrócić systemowy."
    >
      {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '⚙️'}
    </button>
  )
}
