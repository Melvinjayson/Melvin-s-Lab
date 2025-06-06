/**
 * Chat message interface
 */
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date | string;
  agentRole?: string;
  status?: 'sending' | 'sent' | 'error';
}

/**
 * Chat conversation interface
 */
export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
}

/**
 * Chat response interface
 */
export interface ChatResponse {
  message: string;
  taskId: string;
  timestamp: string;
}

/**
 * Agent role type
 */
export type AgentRole = 
  | 'researcher'
  | 'analyst'
  | 'creator'
  | 'critic'
  | 'planner'
  | 'executor'
  | 'mediator'
  | 'teacher'
  | 'ethical_guardian'
  | 'domain_expert';

/**
 * Agent profile interface
 */
export interface AgentProfile {
  role: AgentRole;
  description: string;
  capabilities: string[];
  active: boolean;
}

/**
 * Chat input interface
 */
export interface ChatInput {
  message: string;
  sessionId?: string;
  userId?: string;
}