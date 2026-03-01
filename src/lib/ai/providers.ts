import { google } from '@ai-sdk/google'

// Główny model dla projektowania i czatowania
export const primaryModel = google('gemini-2.0-flash')

// Fallback na wypadek awarii, rate limitu lub dłuższego kontekstu
export const fallbackModel = google('gemini-1.5-pro')

// Helper wybierający model z możliwością łatwej podmiany w całym systemie
export function getModel(type: 'primary' | 'fallback' = 'primary') {
  return type === 'primary' ? primaryModel : fallbackModel
}
