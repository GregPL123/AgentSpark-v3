export function handleGlobalAPIError(error: any) {
  console.error('[API Error]', error?.message || error)

  if (error?.message?.includes('429')) {
    // Miejsce na implementację FALLBACK CHAIN w przyszłości dla Retry
    return new Response(
      JSON.stringify({ error: 'Rate limit providera pobity. Spróbuj powtórzyć akcję.' }),
      { status: 429 }
    )
  }

  return new Response(
    JSON.stringify({ error: 'System napotkał wewnętrzny błąd. Sprawdź logi serwera.' }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
