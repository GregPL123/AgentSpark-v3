import { create } from 'zustand'
import { db, type ProjectDoc } from '@/lib/db'

// Własny, prosty debouncer żeby uniknąć dodatkowej paczki instalacyjnej lodash.
let saveTimer: ReturnType<typeof setTimeout> | null = null
export const saveProjectToDexie = (projectData: ProjectDoc) => {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(async () => {
    try {
      const p = { ...projectData, updatedAt: Date.now() }
      await db.projects.put(p)
      console.log('[Auto-save] project synced to dexie:', p.id)
    } catch (err) {
      console.error('[Auto-save] Error saving to dexie', err)
    }
  }, 3000) // 3-sekundy debounce za kulisami
}

interface ProjectsState {
  activeProjectId: string | null
  projects: Record<string, ProjectDoc>

  setActiveProject: (id: string | null) => void
  loadAllProjects: () => Promise<void>
  loadProject: (id: string) => Promise<void>
  updateCurrentProject: (partialReq: Partial<ProjectDoc>) => void
  createProject: (
    newProject: Omit<ProjectDoc, 'createdAt' | 'updatedAt' | 'readOnly'>
  ) => Promise<string>
  deleteProject: (id: string) => Promise<void>
  clearAllProjects: () => Promise<void>
}

export const useProjectsStore = create<ProjectsState>()((set, get) => ({
  activeProjectId: null,
  projects: {},

  setActiveProject: (id) => set({ activeProjectId: id }),

  loadAllProjects: async () => {
    try {
      const all = await db.projects.toArray()
      const dict: Record<string, ProjectDoc> = {}
      all.forEach((p) => {
        dict[p.id] = p
      })
      set({ projects: dict })
    } catch (err) {
      console.error('[Projects] Failed to load all projects:', err)
    }
  },

  loadProject: async (id) => {
    try {
      const project = await db.projects.get(id)
      if (project) {
        set((state) => ({
          projects: { ...state.projects, [id]: project },
          activeProjectId: id,
        }))
      } else {
        throw new Error('Project not found')
      }
    } catch (err) {
      console.error('[Projects] Failed to load project:', err)
      throw err
    }
  },

  updateCurrentProject: (partialReq) => {
    const { activeProjectId, projects } = get()
    if (!activeProjectId) return

    const currentProject = projects[activeProjectId]
    if (!currentProject) return

    // Określ optymistyczny update lokalnego stanu
    const updated = { ...currentProject, ...partialReq, updatedAt: Date.now() }
    set({ projects: { ...projects, [activeProjectId]: updated } })

    // Zapisz w tle do zdebouncowanej funkcji jeśli nie jest to READONLY (share link)
    if (!updated.readOnly) {
      saveProjectToDexie(updated)
    }
  },

  createProject: async (newProject) => {
    const p: ProjectDoc = {
      ...newProject,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      readOnly: false,
    }

    // Zapiszmy synchronicznie jako stworzenie (nie ma sensu debounce'ować init'a)
    await db.projects.put(p)

    // Ustaw w Zustand
    set((state) => ({
      projects: { ...state.projects, [p.id]: p },
      activeProjectId: p.id,
    }))

    return p.id
  },

  deleteProject: async (id) => {
    await db.projects.delete(id)
    set((state) => {
      const updatedProjects = { ...state.projects }
      delete updatedProjects[id]
      return {
        projects: updatedProjects,
        activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
      }
    })
  },

  clearAllProjects: async () => {
    await db.projects.clear()
    set({ projects: {}, activeProjectId: null })
  },
}))
