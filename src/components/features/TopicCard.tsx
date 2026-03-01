'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import * as React from 'react'

interface TopicCardProps {
  title: string
  description: string
  timeEstimate?: string
  agentTags: string[]
  onClick?: () => void
}

export function TopicCard({
  title,
  description,
  timeEstimate,
  agentTags,
  onClick,
}: TopicCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative w-full text-left p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {timeEstimate && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            {timeEstimate}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{description}</p>

      {/* Agents Preview */}
      <div className="flex flex-wrap gap-1">
        {agentTags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-lg"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.button>
  )
}
