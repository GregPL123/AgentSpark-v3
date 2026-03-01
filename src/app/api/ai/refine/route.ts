import { generateObject } from 'ai'
import { z } from 'zod'
import { handleGlobalAPIError } from '@/lib/ai/error'
import { SYSTEM_PROMPT_REFINE } from '@/lib/ai/prompts'
import { getModel } from '@/lib/ai/providers'
import { checkRateLimit } from '@/lib/ai/rate-limit'

const RefineResponseSchema = z.object({
  role: z
    .string()
    .describe(
      'Ulepszona, profesjonalna rola agenta AI (np. Wiodący Inżynier Frontend zamiast frontendziek).'
    ),
  instructions: z
    .string()
    .describe('Szczegółowa instrukcja i kontekst działania dla tego konkretnego agenta.'),
  emoji: z.string().describe('Jedno pasujące emoji do roli.'),
  color: z.string().describe('Proponowany kolor w formacie HEX (np. #FF5500)'),
})

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
    if (!checkRateLimit(ip)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 })
    }

    const { agentInput, context } = await req.json()

    const { object, usage } = await generateObject({
      model: getModel('primary'),
      schema: RefineResponseSchema,
      system: SYSTEM_PROMPT_REFINE,
      prompt: `Kontekst Projektu: ${context || 'Brak dodatkowego kontekstu.'}\n\nObecny opis Agenta od użytkownika: ${agentInput}\n\nWygeneruj ulepszoną, precyzyjną, spójną strukturę profilu Agenta AI.`,
    })

    console.log(`[Tokens Refine] In: ${usage.promptTokens}, Out: ${usage.completionTokens}`)
    return Response.json(object)
  } catch (err) {
    return handleGlobalAPIError(err)
  }
}
