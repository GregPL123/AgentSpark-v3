'use client'

import * as React from 'react'

export function ContextBar({
  projectName = 'Nowy projekt',
  topic = 'Rozmowa...',
}: {
  projectName?: string
  topic?: string
}) {
  return (
    <div className="sticky top-14 z-20 w-full px-4 py-2 bg-gray-100/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 shadow-sm text-xs flex items-center justify-between">
      <div className="flex items-center gap-2 truncate">
        <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
          {projectName}
        </span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-500 dark:text-gray-400 truncate">{topic}</span>
      </div>
    </div>
  )
}
