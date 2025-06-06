import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import os from 'os';

const router = Router();

/**
 * Get system status
 * @route GET /api/system-status
 */
router.get('/status', asyncHandler(async (req: Request, res: Response) => {
  try {
    // Get system information
    const systemInfo = {
      uptime: process.uptime(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        usage: (1 - os.freemem() / os.totalmem()) * 100
      },
      cpu: os.cpus(),
      platform: os.platform(),
      hostname: os.hostname(),
      loadAverage: os.loadavg(),
      timestamp: new Date().toISOString()
    };

    // Get feature status
    const featureStatus = {
      aiModels: process.env.OPENAI_API_KEY ? true : false,
      dataAcquisition: true,
      knowledgeGraph: true,
      metaLearning: process.env.MODEL_FALLBACK_ENABLED === 'true'
    };

    // Return system status
    res.status(200).json({
      success: true,
      data: {
        system: systemInfo,
        features: featureStatus
      }
    });
  } catch (error) {
    logger.error('Error getting system status:', error);
    throw new AppError('Failed to get system status', 500);
  }
}));

/**
 * Get system logs
 * @route GET /api/system/logs
 * @access Admin only
 */
router.get('/logs', asyncHandler(async (req: Request, res: Response) => {
  // This would typically have authentication middleware to ensure only admins can access
  const { level = 'info', limit = '100', start, end } = req.query;
  
  // In a real implementation, this would fetch logs from a file or database
  // For now, we'll return a mock response
  res.status(200).json({
    success: true,
    data: {
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'System logs endpoint accessed'
        }
      ],
      meta: {
        total: 1,
        level,
        limit
      }
    }
  });
}));

/**
 * Restart system services
 * @route POST /api/system/restart
 * @access Admin only
 */
router.post('/restart', asyncHandler(async (req: Request, res: Response) => {
  // This would typically have authentication middleware to ensure only admins can access
  const { service } = req.body;
  
  if (!service) {
    throw new AppError('Service name is required', 400);
  }
  
  // In a real implementation, this would restart the specified service
  // For now, we'll just log the request and return a success response
  logger.info(`Restart requested for service: ${service}`);
  
  res.status(200).json({
    success: true,
    message: `Service ${service} restart initiated`
  });
}));

export const systemRoutes = router;