import type { Agent, GeneratedFile } from '@/types'

export function generateSwarmAgent(agent: Agent): GeneratedFile {
  const safeName = agent.name.replace(/\s+/g, '_').toLowerCase()

  const content = `from swarm import Agent

${safeName} = Agent(
    name="${agent.name}",
    instructions="You are a ${agent.role}. ${agent.description.replace(/"/g, '\\"')}",
)
`.trim()

  return {
    path: `agents/swarm_${safeName}.py`,
    content,
    language: 'python',
  }
}
