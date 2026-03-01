'use client'

import * as React from 'react'

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gray-200/50 dark:bg-zinc-800/50 ${className}`}
      aria-busy="true"
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {/* Opcjonalna imitacja zawartości */}
      <div className="p-4 space-y-3">
        <div className="w-10 h-10 rounded-full bg-gray-300/40 dark:bg-zinc-700/40" />
        <div className="w-3/4 h-4 rounded bg-gray-300/40 dark:bg-zinc-700/40" />
        <div className="w-1/2 h-3 rounded bg-gray-300/40 dark:bg-zinc-700/40" />
      </div>
    </div>
  )
}
