import Dexie, { type Table } from 'dexie'
import type { Agent, Lang, Level, VersionEntry } from '@/types'

export interface ProjectDoc {
  id: string // uuid v4
  name: string
  topic: string
  level?: Level
  lang: Lang
  originId?: string // id z którego projekt został sklonowany (np. z share-linka)
  createdAt: number
  updatedAt: number
  readOnly: boolean // flaga np. po imporcie z linku
  agents: Agent[]
}

export type VersionDoc = VersionEntry & {
  projectId: string // FK do tabeli projects
  label?: string // opcjonalna etykieta tekstowa snapshotu
}

export class AgentSparkDB extends Dexie {
  projects!: Table<ProjectDoc, string>
  versions!: Table<VersionDoc, string>

  constructor() {
    super('AgentSparkDB')

    // Schemat v1 - domyślny
    this.version(1).stores({
      projects: 'id, updatedAt, originId, readOnly', // indeksy m.in daty i origin
      versions: 'id, projectId, timestamp', // indeksy dla wyszukiwania historii konkretnego projektu
    })

    // Migracja v2 - zaplanowana ewentualna rozbudowa
    this.version(2).upgrade((_tx) => {
      // W wersji 2 na ten moment nic nie zmieniamy,
      // zostawiam przygotowany blok, jak requested.
    })
  }
}

export const db = new AgentSparkDB()

/**
 * Zoptymalizowany interfejs do globalnego zresetowania całej aplikacji lokalnie
 */
export async function clearAllLocalData() {
  await db.projects.clear()
  await db.versions.clear()
  return true
}
