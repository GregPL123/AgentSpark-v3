import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AgentSpark v2',
    short_name: 'AgentSpark',
    description: 'Build your AI agent team in minutes.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a170d',
    theme_color: '#1a170d',
    icons: [
      {
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3E%3Crect width='192' height='192' rx='40' fill='%231a170d'/%3E%3Crect width='192' height='192' rx='40' fill='url(%23g)'/%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='192' y2='192' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23f2b90d' stop-opacity='.25'/%3E%3Cstop offset='1' stop-color='%23f2b90d' stop-opacity='.05'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='96' y='130' font-size='100' text-anchor='middle' fill='%23f2b90d'%3E⚡%3C/text%3E%3C/svg%3E",
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' rx='108' fill='%231a170d'/%3E%3Crect width='512' height='512' rx='108' fill='url(%23g)'/%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='512' y2='512' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23f2b90d' stop-opacity='.25'/%3E%3Cstop offset='1' stop-color='%23f2b90d' stop-opacity='.05'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='256' y='346' font-size='266' text-anchor='middle' fill='%23f2b90d'%3E⚡%3C/text%3E%3C/svg%3E",
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
