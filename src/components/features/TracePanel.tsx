'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Activity, CheckCircle2, Loader2 } from 'lucide-react'
import * as React from 'react'
import { useTraceStore } from '@/stores/useTraceStore'

export function TracePanel() {
  const spans = useTraceStore((state) => state.spans)
  const [ticker, setTicker] = React.useState(0)

  // Zegar wymuszający odświeżanie timerów live "running" statusu
  React.useEffect(() => {
    const int = setInterval(() => setTicker((t) => t + 1), 1000)
    return () => clearInterval(int)
  }, [])

  if (spans.length === 0) return null

  return (
    <div className="flex flex-col gap-2 p-4 bg-white dark:bg-zinc-900 border border-t-0 border-gray-100 dark:border-white/5 shadow-inner">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
        <Activity className="w-4 h-4 text-orange-500" /> System Trace
      </div>
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {spans.map((span) => {
            const now = Date.now()
            const end = span.endTime || now
            const diff = Math.max(0, end - span.startTime)
            const durationStr = (diff / 1000).toFixed(1) + 's'

            return (
              <motion.div
                key={span.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {span.status === 'running' && (
                      <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                    )}
                    {span.status === 'success' && (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    )}
                    <span
                      className={`font-medium ${span.status === 'running' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}
                    >
                      {span.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{durationStr}</span>
                </div>
                {/* Estetyczny pasek ładowania */}
                <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                  {span.status === 'running' ? (
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    />
                  ) : (
                    <div className="h-full bg-emerald-500/50 w-full rounded-full" />
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
