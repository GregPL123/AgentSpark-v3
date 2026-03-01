import { create } from 'zustand'
import { db, type VersionDoc } from '@/lib/db'

interface VersionState {
  versionHistory: VersionDoc[]
  currentVersionId: string | null

  loadVersionHistory: (projectId: string) => Promise<void>
  saveNewVersion: (version: Omit<VersionDoc, 'id'>) => Promise<void>
  restoreVersion: (versionId: string) => Promise<void>
}

export const useVersionStore = create<VersionState>()((set) => ({
  versionHistory: [],
  currentVersionId: null,

  loadVersionHistory: async (projectId) => {
    const history = await db.versions.where({ projectId }).sortBy('timestamp')
    set({ versionHistory: history })
  },

  saveNewVersion: async (version) => {
    const id = crypto.randomUUID()
    const doc: VersionDoc = { ...version, id }
    await db.versions.put(doc)
    set((state) => ({
      versionHistory: [...state.versionHistory, doc],
      currentVersionId: id,
    }))
  },

  restoreVersion: async (versionId) => {
    // W Fazie 4 implementacja z użyciem diff() do odtwarzania konkretnych diffów
    set({ currentVersionId: versionId })
    console.log('[Versions] Restoring snapshot is a mocked placeholder for Faza 4')
  },
}))
