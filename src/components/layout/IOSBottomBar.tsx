'use client'

import { FolderKanban, MessageSquare, Settings } from 'lucide-react'
import * as React from 'react'

export function IOSBottomBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around h-16 pb-safe bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-t border-gray-200 dark:border-white/10 md:hidden">
      <TabButton icon={<MessageSquare />} label="Czat" active />
      <TabButton icon={<FolderKanban />} label="Projekty" />
      <TabButton icon={<Settings />} label="Opcje" />
    </nav>
  )
}

function TabButton({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
}) {
  return (
    <button
      className={`flex flex-col items-center justify-center w-full h-full gap-1 ${active ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
    >
      <div className="w-6 h-6">
        {React.cloneElement(icon as React.ReactElement<any>, { strokeWidth: active ? 2.5 : 2 })}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}
