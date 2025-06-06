import { api } from './api';
import { ChatMessage, ChatResponse, ChatInput, Conversation } from '../types/chat';
import { ApiResponse } from '../types/api';

/**
 * Chat service for interacting with the chat API
 */
class ChatService {
  /**
   * Send a message to the AI
   */
  public async sendMessage(input: ChatInput): Promise<ApiResponse<ChatResponse>> {
    return api.post<ChatResponse>('/chat', input);
  }

  /**
   * Get conversation history
   */
  public async getConversationHistory(
    sessionId: string,
    limit: number = 50,
    before?: string
  ): Promise<ApiResponse<ChatMessage[]>> {
    const params: Record<string, string | number> = { limit };
    if (before) {
      params.before = before;
    }

    return api.get<ChatMessage[]>(`/chat/history/${sessionId}`, { params });
  }

  /**
   * Create a new conversation
   */
  public async createConversation(
    title: string,
    userId: string
  ): Promise<ApiResponse<Conversation>> {
    return api.post<Conversation>('/chat/conversation', { title, userId });
  }

  /**
   * Get user conversations
   */
  public async getUserConversations(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<ApiResponse<Conversation[]>> {
    return api.get<Conversation[]>(`/chat/conversations/${userId}`, {
      params: { limit, offset },
    });
  }

  /**
   * Delete a conversation
   */
  public async deleteConversation(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/chat/conversation/${id}`);
  }

  /**
   * Update conversation title
   */
  public async updateConversationTitle(
    id: string,
    title: string
  ): Promise<ApiResponse<Conversation>> {
    return api.patch<Conversation>(`/chat/conversation/${id}`, { title });
  }

  /**
   * Format a chat message for display
   */
  public formatMessage(message: string): string {
    // Replace newlines with <br> for HTML display
    return message.replace(/\n/g, '<br>');
  }

  /**
   * Parse a markdown message to HTML
   */
  public parseMarkdown(message: string): string {
    // In a real implementation, this would use a markdown parser
    // For now, we'll just return the message with newlines replaced
    return this.formatMessage(message);
  }
}

// Export a singleton instance
export const chatService = new ChatService();

// Export default for testing
export default ChatService;