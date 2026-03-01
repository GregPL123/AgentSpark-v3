'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'

interface MarkdownViewerProps {
  content: string
  className?: string
}

export function MarkdownViewer({ content, className = '' }: MarkdownViewerProps) {
  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none 
         prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:text-zinc-100 
         prose-pre:rounded-xl prose-pre:border-white/10 prose-pre:border ${className}`}
    >
      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
    </div>
  )
}
