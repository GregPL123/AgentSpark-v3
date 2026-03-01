export type Lang = 'en' | 'pl'
export type Level = 'iskra' | 'plomien' | 'pozar' | 'inferno'

export type AgentRole =
  | 'planner'
  | 'researcher'
  | 'writer'
  | 'coder'
  | 'reviewer'
  | 'designer'
  | 'tester'
  | 'coordinator'
  | string

export type AgentType = 'custom' | 'template'

export type Translations = Record<string, string>

export interface GeneratedFile {
  path: string
  content: string
  language: 'typescript' | 'javascript' | 'python' | 'md' | 'yaml' | 'json' | string
  purpose?: string
}

export interface Agent {
  id: string // preferably uuid v4
  name: string
  role: AgentRole
  description: string
  emoji: string
  color: string // hex or tailwind class
  files: GeneratedFile[]
  dependencies?: string[] // ids of other agents
  instructions?: string // system prompt or main instructions
  model?: string // e.g., 'gemini-1.5-flash', 'claude-3.5-sonnet'
}

export interface VersionDiff {
  path: string
  changeType: 'added' | 'modified' | 'removed'
  contentDiff?: string
}

export interface VersionEntry {
  id: string
  timestamp: number
  message: string
  diffs: VersionDiff[]
}

export interface TraceEvent {
  timestamp: number
  name: string
  attributes?: Record<string, any>
}

export interface TraceSpan {
  id: string
  parentId?: string
  name: string
  startTime: number
  endTime?: number
  status: 'running' | 'success' | 'error'
  attributes?: Record<string, any>
  events?: TraceEvent[]
}

export interface SharePayloadV1 {
  version: 1
  data: string
}

export interface SharePayloadV2 {
  version: 2
  data: string
  salt?: string
}

export interface SharePayloadV3 {
  version: 3
  salt: string
  iv: string
  data: string
  schemaHash?: string
}
