import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useChatStore } from '@/stores/useChatStore'

export function useAgentChat() {
  const { messages, addMessage, updateMessage, setTyping } = useChatStore()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  // Trzymamy aktywny kontroler by móc przerywać strumień
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value)
    },
    []
  )

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  const handleSubmit = useCallback(
    async (e?: { preventDefault?: () => void }) => {
      e?.preventDefault?.()
      if (!input.trim() || isLoading) return

      const userMsgContent = input
      setInput('')
      setError(undefined)

      // Dodajemy wiadomość usera od razu by UI było responsywne
      addMessage({
        role: 'user',
        content: userMsgContent,
      })

      setIsLoading(true)
      setTyping(true)

      abortControllerRef.current = new AbortController()

      try {
        // Łapiemy tu pełny aktualny payload, wliczając przed chwilą dodaną akcję (dopiero uaktualni stan)
        const payloadMessages = [
          ...messages.map((m) => ({
            role: m.role === 'ai' || m.role === 'system' ? 'assistant' : 'user',
            content: m.content,
          })),
          { role: 'user', content: userMsgContent },
        ]

        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: payloadMessages }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          throw new Error('Wystąpił problem z połączeniem z serwerem Proxy AI.')
        }

        if (!response.body) throw new Error('Brak strumienia')

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let done = false

        // Tworzymy pustą wiadomość AI do której będziemy strumieniować tokeny
        const aiMessageId = addMessage({
          role: 'assistant', // Zgodnie z backendem
          content: '',
        })

        while (!done) {
          const { value, done: readerDone } = await reader.read()
          done = readerDone
          if (value) {
            const chunk = decoder.decode(value, { stream: true })

            // Proste heurystyki czyszczące strumień w wypadku gdy Vercel opakowuje text w eventy "0: " itp.
            // W zależności od użycia toDataStreamResponse() po drodze z API, text może być oflagowany event stringami
            const cleanText = chunk
              .split('\n')
              .map((line) => {
                if (line.startsWith('0:')) {
                  try {
                    return JSON.parse(line.substring(2))
                  } catch {
                    return ''
                  }
                }
                return line // Fallback do czystego streamu jeśli nie ma eventów
              })
              .join('')

            if (cleanText) {
              // Aktualizujemy dedykowaną, zwracaną przy wstawianiu referencję
              updateMessage(aiMessageId, (prev) => prev + cleanText)
            }
          }
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          toast.info('Zatrzymano odpisywanie.')
        } else {
          setError(err)
          toast.error('Błąd generowania odpowiedzi z AI API.')
        }
      } finally {
        setIsLoading(false)
        setTyping(false)
        abortControllerRef.current = null
      }
    },
    [input, isLoading, messages, addMessage, setTyping, updateMessage]
  )

  const abortGeneration = useCallback(() => {
    if (isLoading) {
      stop()
      setTyping(false)
      setIsLoading(false)
    }
  }, [isLoading, stop, setTyping])

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    abortGeneration,
    error,
  }
}
