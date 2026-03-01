import { create } from 'zustand'
import type { Agent, GeneratedFile } from '@/types'

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error'

interface GenerationState {
  generatedAgents: Agent[]
  generatedFiles: GeneratedFile[]
  status: GenerationStatus

  setGeneratedAgents: (agents: Agent[]) => void
  setGeneratedFiles: (files: GeneratedFile[]) => void
  setStatus: (status: GenerationStatus) => void
  resetGeneration: () => void
}

export const useGenerationStore = create<GenerationState>()((set) => ({
  generatedAgents: [],
  generatedFiles: [],
  status: 'idle',

  setGeneratedAgents: (agents) => set({ generatedAgents: agents }),
  setGeneratedFiles: (files) => set({ generatedFiles: files }),
  setStatus: (status) => set({ status }),
  resetGeneration: () => set({ generatedAgents: [], generatedFiles: [], status: 'idle' }),
}))
