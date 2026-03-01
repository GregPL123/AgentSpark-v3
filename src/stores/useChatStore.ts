import { create } from 'zustand'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  currentQuestionIndex: number // np. przy wywiadzie przed wygenerowaniem Agenta

  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  setTyping: (typing: boolean) => void
  setQuestionIndex: (idx: number) => void
  clearChat: () => void
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  isTyping: false,
  currentQuestionIndex: 0,

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, { ...msg, id: crypto.randomUUID(), timestamp: Date.now() }],
    })),
  setTyping: (isTyping) => set({ isTyping }),
  setQuestionIndex: (idx) => set({ currentQuestionIndex: idx }),
  clearChat: () => set({ messages: [], currentQuestionIndex: 0, isTyping: false }),
}))
