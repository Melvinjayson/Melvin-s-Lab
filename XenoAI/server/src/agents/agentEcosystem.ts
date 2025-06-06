import { logger } from '../utils/logger';
import { query } from '../database';
import { AppError } from '../middleware/errorHandler';
import { Configuration, OpenAIApi } from 'openai';
import { AgentRole, MessageType, AgentMessage, CollaborationTask } from './types';
import { agentProfiles } from './agentProfiles';
import { generateStructuredCompletion } from './aiService';

/**
 * Advanced Agent Ecosystem
 * 
 * This module provides a sophisticated multi-agent collaboration framework for
 * distributing complex tasks across specialized agents with different capabilities.
 * Agents can communicate, share memory, reach consensus, and coordinate their actions.
 */
export class AgentEcosystem {
  private openai: OpenAIApi | null = null;
  private collaborationTasks: Map<string, CollaborationTask> = new Map();
  
  constructor() {
    this.initializeOpenAI();
  }
  
  /**
   * Initialize OpenAI API client
   */
  private initializeOpenAI(): void {
    try {
      if (process.env.OPENAI_API_KEY) {
        const configuration = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        });
        this.openai = new OpenAIApi(configuration);
        logger.info('OpenAI API initialized');
      } else {
        logger.warn('OpenAI API key not provided, using fallback mode');
        this.openai = null;
      }
    } catch (error) {
      logger.error('Failed to initialize OpenAI API:', error);
      this.openai = null;
    }
  }
  
  /**
   * Process a message through the agent ecosystem
   */
  public async processMessage(data: { 
    content: string; 
    sessionId?: string; 
    userId?: string;
  }): Promise<any> {
    try {
      const { content, sessionId, userId } = data;
      
      // Create or retrieve collaboration task
      let taskId = sessionId || `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      let task = this.collaborationTasks.get(taskId);
      
      if (!task) {
        task = await this.createCollaborationTask({
          title: `Conversation ${new Date().toLocaleString()}`,
          description: 'User conversation',
          goal: 'Provide helpful and accurate responses',
          context: 'Conversation with user',
          sessionId,
          userId
        });
      }
      
      // Add user message to task
      const userMessage: AgentMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        type: MessageType.QUERY,
        from: 'user',
        to: task.leadRole,
        content,
        timestamp: new Date(),
        taskId: task.id
      };
      
      task.messages.push(userMessage);
      
      // Process the message through the agent ecosystem
      const response = await this.processCollaborationTask(task, userMessage);
      
      // Store the task
      this.collaborationTasks.set(taskId, task);
      
      // Store in database if sessionId is provided
      if (sessionId && userId) {
        await this.storeMessageInDatabase(userMessage, sessionId, userId, true);
        await this.storeMessageInDatabase(response, sessionId, userId, false);
      }
      
      return {
        message: response.content,
        taskId: task.id,
        timestamp: response.timestamp
      };
    } catch (error) {
      logger.error('Error processing message:', error);
      throw new AppError('Failed to process message', 500);
    }
  }
  
  /**
   * Create a new collaboration task
   */
  public async createCollaborationTask(options: {
    title: string;
    description: string;
    goal: string;
    context: string;
    leadRole?: AgentRole;
    participatingRoles?: AgentRole[];
    sessionId?: string;
    userId?: string;
  }): Promise<CollaborationTask> {
    const {
      title,
      description,
      goal,
      context,
      leadRole = AgentRole.PLANNER,
      participatingRoles = [
        AgentRole.RESEARCHER,
        AgentRole.ANALYST,
        AgentRole.CREATOR,
        AgentRole.CRITIC
      ],
      sessionId,
      userId
    } = options;
    
    // Create task object
    const task: CollaborationTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title,
      description,
      goal,
      context,
      status: 'pending',
      progress: 0,
      startTime: new Date(),
      leadRole,
      participatingRoles: [leadRole, ...participatingRoles.filter(role => role !== leadRole)],
      messages: [],
      sessionId,
      userId,
      result: null
    };
    
    // Store the task
    this.collaborationTasks.set(task.id, task);
    
    // Log task creation
    logger.info(`Created collaboration task: ${task.id} - ${title}`);
    
    return task;
  }
  
  /**
   * Process a collaboration task
   */
  private async processCollaborationTask(
    task: CollaborationTask,
    userMessage: AgentMessage
  ): Promise<AgentMessage> {
    try {
      // Get the lead agent profile
      const leadRole = task.leadRole || AgentRole.PLANNER;
      const leadProfile = agentProfiles.get(leadRole);
      
      if (!leadProfile) {
        throw new AppError(`Profile not found for lead role: ${leadRole}`, 500);
      }
      
      // Prepare context from previous messages
      const messageHistory = task.messages
        .map(msg => ({
          role: msg.from === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
        .slice(-10); // Limit context to last 10 messages
      
      // Generate response using the lead agent
      const prompt = `
        Task: ${task.goal}
        
        You are ${leadRole}, an AI assistant specialized in ${leadProfile.description}.
        
        ${leadProfile.systemPrompt}
        
        Respond to the user's message in a helpful, accurate, and engaging way.
      `;
      
      // Use OpenAI API if available, otherwise use fallback
      let responseContent: string;
      
      if (this.openai && process.env.MODEL_FALLBACK_ENABLED !== 'true') {
        // Use OpenAI API
        const completion = await this.openai.createChatCompletion({
          model: leadProfile.model || 'gpt-4o',
          messages: [
            { role: 'system', content: prompt },
            ...messageHistory
          ],
          temperature: leadProfile.temperature || 0.7,
          max_tokens: leadProfile.maxTokens || 1000
        });
        
        responseContent = completion.data.choices[0]?.message?.content || 
          'I apologize, but I was unable to generate a response.';
      } else {
        // Use fallback (in a real implementation, this would use a local model or template)
        responseContent = await this.generateFallbackResponse(userMessage.content, leadRole);
      }
      
      // Create response message
      const responseMessage: AgentMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        type: MessageType.RESPONSE,
        from: leadRole,
        to: 'user',
        content: responseContent,
        timestamp: new Date(),
        taskId: task.id,
        replyTo: userMessage.id
      };
      
      // Add response to task messages
      task.messages.push(responseMessage);
      
      // Update task progress
      task.progress = 100;
      task.status = 'completed';
      
      return responseMessage;
    } catch (error) {
      logger.error(`Error processing collaboration task ${task.id}:`, error);
      
      // Create error response
      const errorMessage: AgentMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        type: MessageType.ERROR,
        from: task.leadRole,
        to: 'user',
        content: 'I apologize, but I encountered an error while processing your request. Please try again later.',
        timestamp: new Date(),
        taskId: task.id,
        replyTo: userMessage.id
      };
      
      // Add error message to task
      task.messages.push(errorMessage);
      
      // Update task status
      task.status = 'failed';
      
      return errorMessage;
    }
  }
  
  /**
   * Generate a fallback response when OpenAI API is not available
   */
  private async generateFallbackResponse(userMessage: string, role: AgentRole): Promise<string> {
    // In a real implementation, this would use a local model or template
    // For now, we'll return a simple response based on the role
    const profile = agentProfiles.get(role);
    
    return `As ${role}, I understand you're asking about "${userMessage}". 
    
${profile?.description || 'I am an AI assistant'} designed to help with your questions.

However, I'm currently operating in fallback mode with limited capabilities. 
I'd be happy to assist you further when full functionality is restored.`;
  }
  
  /**
   * Store a message in the database
   */
  private async storeMessageInDatabase(
    message: AgentMessage,
    sessionId: string,
    userId: string,
    isUser: boolean
  ): Promise<void> {
    try {
      // Check if conversation exists
      let conversationId: number;
      const conversationResult = await query(
        'SELECT id FROM conversations WHERE id = $1',
        [sessionId]
      );
      
      if (conversationResult.rows.length === 0) {
        // Create new conversation
        const newConversationResult = await query(
          'INSERT INTO conversations (id, user_id, title) VALUES ($1, $2, $3) RETURNING id',
          [sessionId, userId, `Conversation ${new Date().toLocaleString()}`]
        );
        conversationId = newConversationResult.rows[0].id;
      } else {
        conversationId = conversationResult.rows[0].id;
      }
      
      // Store message
      await query(
        'INSERT INTO messages (conversation_id, content, is_user, agent_role) VALUES ($1, $2, $3, $4)',
        [conversationId, message.content, isUser, isUser ? null : message.from]
      );
    } catch (error) {
      logger.error('Error storing message in database:', error);
      // Don't throw here to prevent disrupting the user experience
    }
  }
  
  /**
   * Get conversation history
   */
  public async getConversationHistory(
    sessionId: string,
    limit: number = 50,
    before?: string
  ): Promise<any[]> {
    try {
      let query = `
        SELECT * FROM messages 
        WHERE conversation_id = $1
      `;
      
      const queryParams: any[] = [sessionId];
      
      if (before) {
        query += ' AND created_at < $2';
        queryParams.push(before);
      }
      
      query += ' ORDER BY created_at DESC LIMIT $' + (queryParams.length + 1);
      queryParams.push(limit);
      
      const result = await query(query, queryParams);
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting conversation history:', error);
      throw new AppError('Failed to get conversation history', 500);
    }
  }
  
  /**
   * Create a new conversation
   */
  public async createConversation(title: string, userId: string): Promise<any> {
    try {
      const result = await query(
        'INSERT INTO conversations (user_id, title) VALUES ($1, $2) RETURNING *',
        [userId, title]
      );
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating conversation:', error);
      throw new AppError('Failed to create conversation', 500);
    }
  }
  
  /**
   * Get user conversations
   */
  public async getUserConversations(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<any[]> {
    try {
      const result = await query(
        `
        SELECT c.*, 
               (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) as message_count,
               (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
        FROM conversations c
        WHERE c.user_id = $1
        ORDER BY c.updated_at DESC
        LIMIT $2 OFFSET $3
        `,
        [userId, limit, offset]
      );
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting user conversations:', error);
      throw new AppError('Failed to get user conversations', 500);
    }
  }
}

// Export a singleton instance
export const agentEcosystem = new AgentEcosystem();

// Export function to initialize the agent ecosystem
export const initializeAgentEcosystem = (): AgentEcosystem => {
  return agentEcosystem;
};