'use client'

import { motion, type PanInfo, useAnimation } from 'framer-motion'
import { ChevronRight, Trash2 } from 'lucide-react'
import * as React from 'react'
import type { ProjectDoc } from '@/lib/db'

interface ProjectCardProps {
  project: ProjectDoc
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function ProjectCard({ project, onSelect, onDelete }: ProjectCardProps) {
  const controls = useAnimation()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x
    if (offset < -80) {
      // Snap to delete button width
      controls.start({ x: -80 })
    } else {
      // Snap back
      controls.start({ x: 0 })
    }
  }

  const handleDelete = () => {
    setIsDeleting(true)
    // Give animation time to play before dispatching real delete
    setTimeout(() => onDelete(project.id), 300)
  }

  if (isDeleting) return null // Very rudimentary unmount for aesthetics before rerender

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-red-500 group">
      {/* Obiekt pod spodem - Przycisk Kosza (Swipe Action) */}
      <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center text-white">
        <button
          type="button"
          onClick={handleDelete}
          className="w-full h-full flex flex-col items-center justify-center gap-1"
          aria-label="Usuń projekt"
        >
          <Trash2 className="w-5 h-5" />
          <span className="text-[10px]">Usuń</span>
        </button>
      </div>

      {/* Górna warstwa - Sama Karta */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.1}
        animate={controls}
        onDragEnd={handleDragEnd}
        className="relative w-full p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm flex items-center justify-between"
      >
        <div className="flex-1 cursor-pointer truncate mr-4" onClick={() => onSelect(project.id)}>
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{project.name}</h3>
          <p className="text-xs text-gray-500 truncate mt-1">
            {new Date(project.updatedAt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
            {' • '}
            {project.topic || 'Bez sprecyzowanego tematu'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSelect(project.id)}
          className="p-2 text-gray-400 hover:text-blue-500"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  )
}
