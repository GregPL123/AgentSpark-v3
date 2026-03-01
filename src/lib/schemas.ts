import { z } from 'zod'

export const LevelSchema = z.enum(['iskra', 'plomien', 'pozar', 'inferno'])
export const LangSchema = z.enum(['en', 'pl'])
export const AgentRoleSchema = z.string()
export const AgentTypeSchema = z.enum(['custom', 'template'])

export const GeneratedFileSchema = z
  .object({
    path: z.string().min(1),
    content: z.string(),
    language: z.string(),
    purpose: z.string().optional(),
  })
  .strict()

// Proste wyrażenie na pojedyncze emoji
const emojiRegex = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]$/u

export const AgentSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1),
    role: AgentRoleSchema,
    description: z.string(),
    emoji: z.string().refine((val) => emojiRegex.test(val), {
      message: 'Must be a single emoji character',
    }),
    color: z.string().min(1),
    files: z.array(GeneratedFileSchema),
    dependencies: z.array(z.string().uuid()).optional(),
    instructions: z.string().optional(),
    model: z.string().optional(),
  })
  .strict()

export const SharePayloadV3Schema = z
  .object({
    version: z.literal(3),
    salt: z.string(),
    iv: z.string().optional(),
    data: z.string().min(1), // Base64 encrypted string
    title: z.string().optional(),
    description: z.string().optional(),
    schemaHash: z.string().optional(),
  })
  .strict()

export const ManifestSchema = z
  .object({
    version: z.string().min(1),
    generatedAt: z.number().int().nonnegative(),
    agentsCount: z.number().int().min(0),
  })
  .passthrough() // allows extra metadata if needed for future extensions

export const InterviewChoiceSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    value: z.any(),
    description: z.string().optional(),
  })
  .strict()

export const InterviewQuestionSchema = z
  .object({
    id: z.string().min(1),
    questionText: z.string().min(1),
    choices: z.array(InterviewChoiceSchema),
  })
  .strict()

export type InterviewChoice = z.infer<typeof InterviewChoiceSchema>
export type InterviewQuestion = z.infer<typeof InterviewQuestionSchema>
