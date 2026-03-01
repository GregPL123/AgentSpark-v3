import type { Agent, GeneratedFile } from '@/types'

export function generateAutoGenAgent(agent: Agent): GeneratedFile {
  const safeName = agent.name.replace(/\s+/g, '_').toLowerCase()

  const content = `from autogen import AssistantAgent

${safeName} = AssistantAgent(
    name="${safeName}",
    system_message="You are a helpful ${agent.role} named ${agent.name}. ${agent.description.replace(/"/g, '\\"')}",
    llm_config={"config_list": [{"model": "gpt-4"}]}
)
`.trim()

  return {
    path: `agents/autogen_${safeName}.py`,
    content,
    language: 'python',
  }
}
