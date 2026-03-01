import type { Agent, GeneratedFile } from '@/types'

export function generateLangGraphAgent(agent: Agent): GeneratedFile {
  const safeName = agent.name.replace(/\s+/g, '_').toLowerCase()

  const content = `from langgraph.graph import Graph

def ${safeName}_node(state):
    print("Executing ${agent.role}: ${agent.name}")
    # Goal: ${agent.description.replace(/'/g, "\\'")}
    return state

# Add this node to your LangGraph workflow
# workflow.add_node("${safeName}", ${safeName}_node)
`.trim()

  return {
    path: `agents/langgraph_${safeName}.py`,
    content,
    language: 'python',
  }
}
