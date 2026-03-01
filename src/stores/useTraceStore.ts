import { create } from 'zustand'
import type { TraceSpan } from '@/types'

interface TraceState {
  spans: TraceSpan[]
  liveSpanId: string | null

  addSpan: (span: TraceSpan) => void
  updateSpan: (id: string, updates: Partial<TraceSpan>) => void
  clearSpans: () => void
}

export const useTraceStore = create<TraceState>()((set) => ({
  spans: [],
  liveSpanId: null,

  addSpan: (span) =>
    set((state) => ({
      spans: [...state.spans, span],
      liveSpanId: span.id,
    })),

  updateSpan: (id, updates) =>
    set((state) => ({
      spans: state.spans.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),

  clearSpans: () => set({ spans: [], liveSpanId: null }),
}))
