'use client'

import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'
import * as React from 'react'
import { MarkdownViewer } from '@/components/ui/MarkdownViewer'

interface ChatMessageProps {
  role: 'user' | 'ai'
  content: string
  isTyping?: boolean
}

export function ChatMessage({ role, content, isTyping }: ChatMessageProps) {
  const isAI = role === 'ai'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full gap-3 p-4 ${isAI ? 'bg-transparent' : 'flex-row-reverse bg-gray-50/50 dark:bg-white/5 rounded-2xl'}`}
    >
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isAI ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-gray-200 text-gray-600 dark:bg-zinc-700 dark:text-gray-300'}`}
      >
        {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      <div className={`flex flex-col ${!isAI ? 'items-end' : ''} max-w-[85%]`}>
        <div
          className={`text-sm leading-relaxed ${isAI ? 'text-gray-800 dark:text-gray-200' : 'text-gray-900 dark:text-white'}`}
        >
          {isTyping ? (
            <div className="flex gap-1 items-center h-6">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.4, delay: 0 }}
                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }}
                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }}
                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
              />
            </div>
          ) : (
            <MarkdownViewer content={content} />
          )}
        </div>
      </div>
    </motion.div>
  )
}
