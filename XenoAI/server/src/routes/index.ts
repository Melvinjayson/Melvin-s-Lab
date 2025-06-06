import { Express } from 'express';
import { chatRoutes } from './chatRoutes';
import { authRoutes } from './authRoutes';
import { systemRoutes } from './systemRoutes';
import { knowledgeGraphRoutes } from './knowledgeGraphRoutes';
import { AgentEcosystem } from '../agents/agentEcosystem';

/**
 * Setup all API routes
 */
export const setupRoutes = (app: Express, agentEcosystem: AgentEcosystem): void => {
  // API version prefix
  const apiPrefix = '/api';
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // Setup routes with API prefix
  app.use(`${apiPrefix}/auth`, authRoutes);
  app.use(`${apiPrefix}/chat`, chatRoutes(agentEcosystem));
  app.use(`${apiPrefix}/system`, systemRoutes);
  app.use(`${apiPrefix}/knowledge-graph`, knowledgeGraphRoutes);
  
  // 404 handler for API routes
  app.use(`${apiPrefix}/*`, (req, res) => {
    res.status(404).json({ 
      success: false, 
      error: { message: 'API endpoint not found' } 
    });
  });
};