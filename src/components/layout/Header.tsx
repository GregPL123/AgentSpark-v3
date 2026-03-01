'use client'

import { Menu } from 'lucide-react'
import * as React from 'react'
import { ThemeToggleButton } from '@/components/providers/ThemeProvider'

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full flex items-center justify-between px-4 h-14 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 pt-safe">
      <div className="flex items-center gap-2">
        <button
          className="p-2 -ml-2 rounded-full active:bg-gray-200 dark:active:bg-white/10 transition-colors"
          aria-label="Otwórz menu boczne"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
          AgentSpark
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggleButton />
      </div>
    </header>
  )
}
