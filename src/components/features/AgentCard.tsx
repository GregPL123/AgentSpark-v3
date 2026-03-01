'use client'

import { motion } from 'framer-motion'
import { Bot, FileCode } from 'lucide-react'
import * as React from 'react'

interface AgentCardProps {
  name: string
  role: string
  isWorking?: boolean
  filesGenerated?: string[]
  justUpdated?: boolean // trigger pingu informującego o nowym wygenerowanym pliku
}

export function AgentCard({
  name,
  role,
  isWorking,
  filesGenerated = [],
  justUpdated,
}: AgentCardProps) {
  return (
    <motion.div
      initial={false}
      animate={
        justUpdated
          ? { scale: [1, 1.03, 1], borderColor: ['var(--border)', '#3b82f6', 'var(--border)'] }
          : {}
      }
      transition={{ duration: 0.5 }}
      className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 shadow-sm flex flex-col gap-3 relative overflow-hidden"
    >
      {isWorking && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/20 to-transparent pointer-events-none" />
      )}

      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className={`p-2 rounded-xl ${isWorking ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-gray-100 text-gray-500 dark:bg-zinc-800'}`}
          >
            <Bot className="w-6 h-6" />
          </div>
          {isWorking && (
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white dark:border-zinc-900"></span>
            </span>
          )}
        </div>
        <div>
          <h4 className="font-medium text-sm text-gray-900 dark:text-white">{name}</h4>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>

      {filesGenerated.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1 border-t border-gray-100 dark:border-white/5 pt-3">
          {filesGenerated.map((file) => (
            <div
              key={file}
              className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-white/5"
            >
              <FileCode className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] text-gray-600 dark:text-gray-300 truncate max-w-[100px]">
                {file}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
