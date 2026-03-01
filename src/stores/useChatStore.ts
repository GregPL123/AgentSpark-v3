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

  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => string
  updateMessage: (id: string, contentAction: (prev: string) => string) => void
  setTyping: (typing: boolean) => void
  setQuestionIndex: (idx: number) => void
  clearChat: () => void
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  isTyping: false,
  currentQuestionIndex: 0,

  addMessage: (msg) => {
    const id = crypto.randomUUID()
    set((state) => ({
      messages: [...state.messages, { ...msg, id, timestamp: Date.now() }],
    }))
    return id
  },
  updateMessage: (id, contentAction) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content: contentAction(m.content) } : m
      ),
    })),
  setTyping: (isTyping) => set({ isTyping }),
  setQuestionIndex: (idx) => set({ currentQuestionIndex: idx }),
  clearChat: () => set({ messages: [], currentQuestionIndex: 0, isTyping: false }),
}))
