import { streamText } from 'ai'
import { handleGlobalAPIError } from '@/lib/ai/error'
import { SYSTEM_PROMPT_CHAT } from '@/lib/ai/prompts'
import { getModel } from '@/lib/ai/providers'
import { checkRateLimit } from '@/lib/ai/rate-limit'

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
    if (!checkRateLimit(ip)) {
      return new Response('Rate limit exceeded. Zbyt wiele zapytań z tego IP.', { status: 429 })
    }

    const { messages } = await req.json()

    const result = streamText({
      model: getModel('primary'),
      system: SYSTEM_PROMPT_CHAT,
      messages,
      onFinish: (result) => {
        console.log(
          `[Token Usage Chat] IP:${ip} | In: ${result.usage.promptTokens}, Out: ${result.usage.completionTokens}`
        )
      },
    })

    return result.toDataStreamResponse()
  } catch (err: any) {
    return handleGlobalAPIError(err)
  }
}
