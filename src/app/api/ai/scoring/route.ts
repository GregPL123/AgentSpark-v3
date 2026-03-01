import { generateObject } from 'ai'
import { z } from 'zod'
import { handleGlobalAPIError } from '@/lib/ai/error'
import { SYSTEM_PROMPT_SCORING } from '@/lib/ai/prompts'
import { getModel } from '@/lib/ai/providers'
import { checkRateLimit } from '@/lib/ai/rate-limit'
import { LevelSchema } from '@/lib/schemas'

// Wyjściowa struktura oceny projektu
const ScoringResponseSchema = z.object({
  topic: z
    .string()
    .describe('Sugerowana nazwa projektu w jednym-dwóch słowach (np. "System CRM", "Gra 2D")'),
  complexity: LevelSchema.describe(
    'Oszacowana złożoność systemu. iskra: bardzo proste, plomien: średnie, pozar: trudne, inferno: bardzo zaawansowane.'
  ),
  suggestedAgentsCount: z
    .number()
    .int()
    .min(1)
    .max(20)
    .describe('Ilość sugerowanych agentów od 1 do 20.'),
  reasoning: z
    .string()
    .describe('Krótki argument, dlaczego taka liczba agentów jest optymalna do tego zadania.'),
})

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
    if (!checkRateLimit(ip)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 })
    }

    const { prompt } = await req.json()

    // Zod parsing is native
    const { object, usage } = await generateObject({
      model: getModel('primary'),
      schema: ScoringResponseSchema,
      system: SYSTEM_PROMPT_SCORING,
      prompt: `Zanalizuj następujący pomysł i rzetelnie wyciągnij z niego metadane operacyjne dla systemu multi-agentowego:\n\n${prompt}`,
    })

    console.log(`[Tokens Scoring] In: ${usage.promptTokens}, Out: ${usage.completionTokens}`)
    return Response.json(object)
  } catch (err) {
    return handleGlobalAPIError(err)
  }
}
