import type { Agent, GeneratedFile } from '@/types'

export function generateCrewAIAgent(agent: Agent): GeneratedFile {
  // Convert name to python snake_case
  const safeName = agent.name.replace(/\s+/g, '_').toLowerCase()

  const content = `from crewai import Agent

${safeName} = Agent(
    role='${agent.role}',
    goal='${agent.description.replace(/'/g, "\\'")}',
    backstory='You are a helpful ${agent.role} named ${agent.name}',
    verbose=True,
    allow_delegation=False
)
`.trim()

  return {
    path: `agents/crewai_${safeName}.py`,
    content,
    language: 'python',
  }
}
