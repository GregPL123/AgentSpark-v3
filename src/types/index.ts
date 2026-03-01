export type Lang = 'en' | 'pl';
export type Level = 'iskra' | 'plomien' | 'pozar' | 'inferno';
export type AgentRole = 'developer' | 'designer' | 'analyst' | 'reviewer' | string;
export type AgentType = 'custom' | 'template';

export type Translations = Record<string, string>;

export interface GeneratedFile {
    path: string;
    content: string;
    language: string;
    purpose?: string;
}

export interface Agent {
    id: string;
    name: string;
    role: AgentRole;
    description: string;
    emoji: string;
    color: string;
    files: GeneratedFile[];
    dependencies?: string[];
}

export interface VersionDiff {
    path: string;
    changeType: 'added' | 'modified' | 'removed';
    contentDiff?: string;
}

export interface VersionEntry {
    id: string;
    timestamp: number;
    message: string;
    diffs: VersionDiff[];
}

export interface TraceEvent {
    name: string;
    timestamp: number;
    data?: any;
}

export interface TraceSpan {
    id: string;
    name: string;
    startTime: number;
    endTime?: number;
    status: 'pending' | 'success' | 'error';
    events: TraceEvent[];
}

export interface SharePayloadV1 {
    version: 1;
    data: string;
}

export interface SharePayloadV2 {
    version: 2;
    data: string;
    salt?: string;
}

export interface SharePayloadV3 {
    version: 3;
    salt: string;
    iv: string;
    data: string;
    schemaHash?: string;
}
