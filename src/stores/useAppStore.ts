import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Lang } from '@/types'

export type Theme = 'light' | 'dark' | 'system'

interface AppState {
  theme: Theme
  lang: Lang
  sharedMode: boolean // Ephemeral flag mostly tracking if app is in read-only visual mode

  setTheme: (t: Theme) => void
  setLang: (l: Lang) => void
  setSharedMode: (state: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      lang: 'en',
      sharedMode: false,
      setTheme: (theme) => set({ theme }),
      setLang: (lang) => set({ lang }),
      setSharedMode: (sharedMode) => set({ sharedMode }),
    }),
    {
      name: 'agentspark-app-storage',
      // Zapisujemy tylko preferencyjne dane, ignorujemy flagę sharedMode
      // i inne ulotne metadane
      partialize: (state) => ({ theme: state.theme, lang: state.lang }),
      storage: createJSONStorage(() => localStorage),
    }
  )
)
