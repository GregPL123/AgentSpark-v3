import JSZip from 'jszip'
import { db, type ProjectDoc } from '@/lib/db'
import { AgentSchema, ManifestSchema } from '@/lib/schemas'

export interface ImportPreviewResult {
  agentsCount: number
  previewList: string[]
  data: ProjectDoc
}

export async function parseZipImport(file: File): Promise<ImportPreviewResult> {
  const zip = await JSZip.loadAsync(file)
  const manifestFile = zip.file('manifest.json')

  if (!manifestFile) {
    throw new Error('Odrzucono: Brak pliku manifest.json w archiwum.')
  }

  const text = await manifestFile.async('string')
  let rawData: any
  try {
    rawData = JSON.parse(text)
  } catch (err) {
    throw new Error('Odrzucono: Plik manifest.json jest uszkodzony.')
  }

  // Używamy zdefiniowanego schema Zod z fazy 1
  const parsedManifest = ManifestSchema.parse(rawData)

  if (!parsedManifest.project) {
    throw new Error('Odrzucono: Zgodny manifest, ale nie zawiera klucza project z właściwym root.')
  }

  // Zabezpieczenie schema dla każdego wczytywanego Agenta, by wyłapać ewentualne ręczne defekty json
  const validAgents = (parsedManifest.project as ProjectDoc).agents.map((agentData: any) => {
    try {
      return AgentSchema.parse(agentData)
    } catch (e) {
      throw new Error(`Odrzucono: Uszkodzony profil agenta - ${agentData.name || 'Unknown'}`)
    }
  })

  const finalProject: ProjectDoc = {
    ...(parsedManifest.project as ProjectDoc),
    agents: validAgents,
  }

  // Zbieranie nazw agentów dla UI Preview (Fazy 4)
  const agentNames = validAgents.map((a: any) => a.name)

  return {
    agentsCount: parsedManifest.agentsCount,
    previewList: agentNames,
    data: finalProject,
  }
}

/**
 * Faktycznie importuje zewalodiwany ProjectDoc do DB bocznego "origin" w Store
 * Ta f-cja zostanie wpięta w UI po wciśnięciu "Zatwierdź" w okienku Preview
 */
export async function commitImportedZipToDb(project: ProjectDoc) {
  // Generujemy mu fork-ID by nie nadgorliwie ukraść tożsamości po chmurze Dexie
  const clonedObj: ProjectDoc = {
    ...project,
    id: crypto.randomUUID(),
    originId: project.id,
    readOnly: true, // Zablokowany dla bezpieczeństwa "oryginału", user może zrobić "Duplikuj"
    name: `(Import) ${project.name}`,
  }

  await db.projects.put(clonedObj)
  return clonedObj.id
}
