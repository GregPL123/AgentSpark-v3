import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { PwaPrompt } from '@/components/features/PwaPrompt'
import { SWRegistry } from '@/components/providers/SWRegistry'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ToastProvider } from '@/components/providers/ToastProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#1a170d',
}

export const metadata: Metadata = {
  title: 'AgentSpark v2',
  description: 'Prosty interfejs wspierający wieloagentowe konwersacje.',
  appleWebApp: {
    capable: true,
    title: 'AgentSpark',
    statusBarStyle: 'black-translucent',
  },
  manifest: '/manifest.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // suppresHydrationWarning na <html> jest wskazane przez next-themes (unika migotania i mismatch erroru)
  return (
    <html lang="pl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 min-h-[100dvh] flex flex-col`}
      >
        <ThemeProvider>
          {children}
          <ToastProvider />
          <SWRegistry />
          <PwaPrompt />
        </ThemeProvider>
      </body>
    </html>
  )
}
