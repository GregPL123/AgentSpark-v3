import type { ProjectDoc } from '@/lib/db'
import { generateAutoGenAgent } from '../agents/autogen'
import { generateCrewAIAgent } from '../agents/crewai'
import { generateLangGraphAgent } from '../agents/langgraph'
import { generateSwarmAgent } from '../agents/swarm'

export async function exportProjectToZip(project: ProjectDoc): Promise<Blob> {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()

  // Root Manifest
  const manifestData = {
    version: '1.0.0', // format payload wersji zip, a nie share payload!
    generatedAt: Date.now(),
    agentsCount: project.agents.length,
    project: project, // Opcjonalnie zrzucamy cały stan
  }

  zip.file('manifest.json', JSON.stringify(manifestData, null, 2))

  // Generatory w folderze agents/
  const agentsFolder = zip.folder('agents')
  if (agentsFolder) {
    for (const agent of project.agents) {
      // Dla sztuki demo zrzucamy stubs dla każdego frameworka
      const crewFile = generateCrewAIAgent(agent)
      const lgFile = generateLangGraphAgent(agent)
      const autoFile = generateAutoGenAgent(agent)
      const swarmFile = generateSwarmAgent(agent)

      agentsFolder.file(crewFile.path.replace('agents/', ''), crewFile.content)
      agentsFolder.file(lgFile.path.replace('agents/', ''), lgFile.content)
      agentsFolder.file(autoFile.path.replace('agents/', ''), autoFile.content)
      agentsFolder.file(swarmFile.path.replace('agents/', ''), swarmFile.content)

      // Skopiuj te customowe przypisane manualnie pliki również
      for (const f of agent.files) {
        agentsFolder.file(`${agent.name.toLowerCase()}_${f.path}`, f.content)
      }
    }
  }

  // Wskazówka
  zip.file('README.md', `# ${project.name}\n\nWygenerowano w AgentSpark v2.`)

  return await zip.generateAsync({ type: 'blob' })
}
