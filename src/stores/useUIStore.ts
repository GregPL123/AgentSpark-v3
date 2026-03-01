import { create } from 'zustand'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type: 'info' | 'success' | 'warning' | 'error'
}

interface UIState {
  sidebarCollapsed: boolean
  toastQueue: ToastMessage[]
  modalStack: string[]

  toggleSidebar: () => void
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
  pushModal: (modalId: string) => void
  popModal: () => void
  closeAllModals: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  toastQueue: [],
  modalStack: [],

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  addToast: (t) => {
    const toast = { ...t, id: crypto.randomUUID() }
    set((state) => ({ toastQueue: [...state.toastQueue, toast] }))
  },
  removeToast: (id) =>
    set((state) => ({ toastQueue: state.toastQueue.filter((t) => t.id !== id) })),

  pushModal: (modalId) => set((state) => ({ modalStack: [...state.modalStack, modalId] })),
  popModal: () => set((state) => ({ modalStack: state.modalStack.slice(0, -1) })),
  closeAllModals: () => set({ modalStack: [] }),
}))
