/**
 * Agent roles and specializations
 */
export enum AgentRole {
  RESEARCHER = 'researcher',
  ANALYST = 'analyst',
  CREATOR = 'creator',
  CRITIC = 'critic',
  PLANNER = 'planner',
  EXECUTOR = 'executor',
  MEDIATOR = 'mediator',
  TEACHER = 'teacher',
  ETHICAL_GUARDIAN = 'ethical_guardian',
  DOMAIN_EXPERT = 'domain_expert'
}

/**
 * Agent message types
 */
export enum MessageType {
  QUERY = 'query',
  RESPONSE = 'response',
  PROPOSAL = 'proposal',
  DECISION = 'decision',
  ACTION = 'action',
  ERROR = 'error',
  META = 'meta'
}

/**
 * Agent message interface
 */
export interface AgentMessage {
  id: string;
  type: MessageType;
  from: AgentRole | 'user';
  to: AgentRole | 'user' | 'all';
  content: string;
  attachments?: any[];
  replyTo?: string;
  taskId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Collaboration task interface
 */
export interface CollaborationTask {
  id: string;
  title: string;
  description: string;
  goal: string;
  context: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  leadRole: AgentRole;
  participatingRoles: AgentRole[];
  messages: AgentMessage[];
  sessionId?: string;
  userId?: string;
  result: any;
}

/**
 * Agent profile interface
 */
export interface AgentProfile {
  role: AgentRole;
  description: string;
  capabilities: string[];
  model: string;
  temperature: number;
  systemPrompt: string;
  maxTokens: number;
}

/**
 * Data categories for privacy and security
 */
export enum DataCategory {
  SYSTEM = 'system',
  CONVERSATION = 'conversation',
  PERSONAL = 'personal',
  SENSITIVE = 'sensitive',
  GENERATED = 'generated'
}