import { z } from 'zod';

// Level & Lang zgodne z ujednoliceniem w types/index.ts
export const LevelSchema = z.enum(['iskra', 'plomien', 'pozar', 'inferno']);
export const LangSchema = z.enum(['en', 'pl']);
export const AgentRoleSchema = z.string(); // Może być rozszerzone w przyszłości, aktualnie jako string bazowy.
export const AgentTypeSchema = z.enum(['custom', 'template']);

export const GeneratedFileSchema = z.object({
    path: z.string(),
    content: z.string(),
    language: z.string(),
    purpose: z.string().optional()
});

export const AgentSchema = z.object({
    id: z.string().uuid().or(z.string()),
    name: z.string().min(1),
    role: AgentRoleSchema,
    description: z.string(),
    emoji: z.string(),
    color: z.string(),
    files: z.array(GeneratedFileSchema),
    dependencies: z.array(z.string()).optional()
});

// Payload schemas for backwards compatibility
export const SharePayloadV1Schema = z.object({
    version: z.literal(1),
    data: z.string()
});

export const SharePayloadV2Schema = z.object({
    version: z.literal(2),
    data: z.string(),
    salt: z.string().optional()
});

export const SharePayloadV3Schema = z.object({
    version: z.literal(3),
    salt: z.string(),
    iv: z.string(),
    data: z.string(),
    schemaHash: z.string().optional()
});

export const ManifestSchema = z.object({
    version: z.string(),
    generatedAt: z.number(),
    agentsCount: z.number().int().min(0),
    // Additional manifest fields can be added below
});

export const InterviewChoiceSchema = z.object({
    id: z.string(),
    label: z.string(),
    value: z.any()
});

export const InterviewQuestionSchema = z.object({
    id: z.string(),
    questionText: z.string(),
    choices: z.array(InterviewChoiceSchema)
});
