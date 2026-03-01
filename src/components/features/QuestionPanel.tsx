'use client'

import { motion } from 'framer-motion'
import { MousePointerClick } from 'lucide-react'
import * as React from 'react'
import type { InterviewQuestion } from '@/lib/schemas'

interface QuestionPanelProps {
  question: InterviewQuestion
  onAnswer: (choiceId: string, value: unknown) => void
}

export function QuestionPanel({ question, onAnswer }: QuestionPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="p-5 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl shadow-blue-900/5 border border-blue-100 dark:border-blue-500/20"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
          <MousePointerClick className="w-4 h-4" />
        </span>
        <h3 className="font-semibold text-gray-900 dark:text-white">{question.questionText}</h3>
      </div>

      <div className="flex flex-col gap-2">
        {question.choices.map((choice) => (
          <motion.button
            type="button"
            key={choice.id}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(choice.id, choice.value)}
            className="w-full text-left p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 dark:bg-zinc-950 dark:hover:bg-blue-500/10 border border-gray-200 dark:border-white/5 transition-colors"
          >
            <span className="block font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
              {choice.label}
            </span>
            {choice.description && (
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                {choice.description}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
