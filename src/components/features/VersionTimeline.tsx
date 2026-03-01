'use client'

import { motion } from 'framer-motion'
import { GitCommit, Undo2 } from 'lucide-react'
import * as React from 'react'
import { useVersionStore } from '@/stores/useVersionStore'

export function VersionTimeline({ projectId }: { projectId: string }) {
  const { versionHistory, currentVersionId, restoreVersion } = useVersionStore()

  if (versionHistory.length === 0) return null

  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-4 px-4 bg-gray-50/50 dark:bg-zinc-950/50 border-y border-white/5">
      <div className="flex items-center gap-4 w-max">
        {versionHistory.map((version) => {
          const isActive = version.id === currentVersionId
          return (
            <motion.div
              key={version.id}
              className={`flex relative flex-col items-center gap-2 p-3 rounded-2xl border min-w-[140px] transition-colors ${isActive ? 'bg-white dark:bg-zinc-900 border-blue-500 shadow-sm' : 'bg-transparent border-gray-200 dark:border-white/5 hover:bg-white dark:hover:bg-zinc-900'}`}
            >
              <GitCommit className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
              <div className="text-center">
                <p
                  className={`text-[11px] font-mono ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}
                >
                  {version.id.substring(0, 7)}
                </p>
                <p className="text-[10px] text-gray-400">
                  {new Date(version.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <p className="text-xs text-center max-w-[120px] truncate text-gray-600 dark:text-gray-300">
                {version.label || 'Brak opisu'}
              </p>

              {!isActive && (
                <button
                  type="button"
                  onClick={() => restoreVersion(version.id)}
                  className="mt-2 text-[10px] flex items-center gap-1 text-gray-500 hover:text-blue-600 px-2 py-1 rounded bg-gray-100 dark:bg-white/5"
                >
                  <Undo2 className="w-3 h-3" /> Przywróć
                </button>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
