import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AgentEcosystem } from '../agents/agentEcosystem';
import { logger } from '../utils/logger';

/**
 * Create and configure chat routes
 */
export const chatRoutes = (agentEcosystem: AgentEcosystem) => {
  const router = Router();

  /**
   * Send a message to the agent ecosystem
   * @route POST /api/chat
   */
  router.post('/', asyncHandler(async (req: Request, res: Response) => {
    const { message, sessionId, userId } = req.body;

    // Validate request
    if (!message) {
      throw new AppError('Message is required', 400);
    }

    // Process the message through the agent ecosystem
    const response = await agentEcosystem.processMessage({
      content: message,
      sessionId,
      userId
    });

    // Return the response
    res.status(200).json({
      success: true,
      data: response
    });
  }));

  /**
   * Get conversation history
   * @route GET /api/chat/history/:sessionId
   */
  router.get('/history/:sessionId', asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { limit = '50', before } = req.query;

    // Validate session ID
    if (!sessionId) {
      throw new AppError('Session ID is required', 400);
    }

    // Get conversation history
    const history = await agentEcosystem.getConversationHistory(
      sessionId, 
      parseInt(limit as string), 
      before as string
    );

    // Return the history
    res.status(200).json({
      success: true,
      data: history
    });
  }));

  /**
   * Create a new conversation
   * @route POST /api/chat/conversation
   */
  router.post('/conversation', asyncHandler(async (req: Request, res: Response) => {
    const { title, userId } = req.body;

    // Validate request
    if (!title) {
      throw new AppError('Conversation title is required', 400);
    }

    if (!userId) {
      throw new AppError('User ID is required', 400);
    }

    // Create a new conversation
    const conversation = await agentEcosystem.createConversation(title, userId);

    // Return the new conversation
    res.status(201).json({
      success: true,
      data: conversation
    });
  }));

  /**
   * Get user conversations
   * @route GET /api/chat/conversations/:userId
   */
  router.get('/conversations/:userId', asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { limit = '10', offset = '0' } = req.query;

    // Validate user ID
    if (!userId) {
      throw new AppError('User ID is required', 400);
    }

    // Get user conversations
    const conversations = await agentEcosystem.getUserConversations(
      userId,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    // Return the conversations
    res.status(200).json({
      success: true,
      data: conversations
    });
  }));

  return router;
};