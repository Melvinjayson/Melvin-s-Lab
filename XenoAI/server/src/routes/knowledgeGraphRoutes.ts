import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { query } from '../database';

const router = Router();

/**
 * Get knowledge graph nodes and edges
 * @route GET /api/knowledge-graph
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { limit = '100', category } = req.query;
  
  try {
    // Get nodes
    let nodesQuery = 'SELECT * FROM knowledge_nodes';
    const queryParams: any[] = [];
    
    if (category) {
      nodesQuery += ' WHERE category = $1';
      queryParams.push(category);
    }
    
    nodesQuery += ` LIMIT $${queryParams.length + 1}`;
    queryParams.push(limit);
    
    const nodesResult = await query(nodesQuery, queryParams);
    
    // Get edges for these nodes
    const nodeIds = nodesResult.rows.map(node => node.id);
    
    let edgesQuery = 'SELECT * FROM knowledge_edges WHERE source_id = ANY($1) OR target_id = ANY($1)';
    const edgesResult = await query(edgesQuery, [nodeIds]);
    
    // Return nodes and edges
    res.status(200).json({
      success: true,
      data: {
        nodes: nodesResult.rows,
        edges: edgesResult.rows
      }
    });
  } catch (error) {
    logger.error('Error fetching knowledge graph:', error);
    throw new AppError('Failed to fetch knowledge graph', 500);
  }
}));

/**
 * Get a specific node and its connections
 * @route GET /api/knowledge-graph/node/:id
 */
router.get('/node/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    // Get node
    const nodeResult = await query('SELECT * FROM knowledge_nodes WHERE id = $1', [id]);
    
    if (nodeResult.rows.length === 0) {
      throw new AppError('Node not found', 404);
    }
    
    const node = nodeResult.rows[0];
    
    // Get connected nodes (both incoming and outgoing connections)
    const edgesQuery = `
      SELECT e.*, 
             n1.title as source_title, n1.category as source_category,
             n2.title as target_title, n2.category as target_category
      FROM knowledge_edges e
      JOIN knowledge_nodes n1 ON e.source_id = n1.id
      JOIN knowledge_nodes n2 ON e.target_id = n2.id
      WHERE e.source_id = $1 OR e.target_id = $1
    `;
    
    const edgesResult = await query(edgesQuery, [id]);
    
    // Return node and its connections
    res.status(200).json({
      success: true,
      data: {
        node,
        connections: edgesResult.rows
      }
    });
  } catch (error) {
    logger.error(`Error fetching node ${id}:`, error);
    throw new AppError('Failed to fetch node', 500);
  }
}));

/**
 * Search knowledge graph
 * @route GET /api/knowledge-graph/search
 */
router.get('/search', asyncHandler(async (req: Request, res: Response) => {
  const { q, limit = '20' } = req.query;
  
  if (!q) {
    throw new AppError('Search query is required', 400);
  }
  
  try {
    // Search nodes
    const searchQuery = `
      SELECT * FROM knowledge_nodes
      WHERE title ILIKE $1 OR content ILIKE $1
      LIMIT $2
    `;
    
    const searchResult = await query(searchQuery, [`%${q}%`, limit]);
    
    // Return search results
    res.status(200).json({
      success: true,
      data: {
        results: searchResult.rows,
        count: searchResult.rows.length
      }
    });
  } catch (error) {
    logger.error(`Error searching knowledge graph for "${q}":`, error);
    throw new AppError('Failed to search knowledge graph', 500);
  }
}));

/**
 * Add a new node to the knowledge graph
 * @route POST /api/knowledge-graph/node
 */
router.post('/node', asyncHandler(async (req: Request, res: Response) => {
  const { title, content, category } = req.body;
  
  if (!title || !content) {
    throw new AppError('Title and content are required', 400);
  }
  
  try {
    // Insert new node
    const result = await query(
      'INSERT INTO knowledge_nodes (title, content, category) VALUES ($1, $2, $3) RETURNING *',
      [title, content, category]
    );
    
    const newNode = result.rows[0];
    
    // Return the new node
    res.status(201).json({
      success: true,
      data: newNode
    });
  } catch (error) {
    logger.error('Error adding knowledge node:', error);
    throw new AppError('Failed to add knowledge node', 500);
  }
}));

/**
 * Add a new edge to the knowledge graph
 * @route POST /api/knowledge-graph/edge
 */
router.post('/edge', asyncHandler(async (req: Request, res: Response) => {
  const { sourceId, targetId, relationshipType, weight = 1.0 } = req.body;
  
  if (!sourceId || !targetId || !relationshipType) {
    throw new AppError('Source ID, target ID, and relationship type are required', 400);
  }
  
  try {
    // Check if nodes exist
    const nodesResult = await query(
      'SELECT id FROM knowledge_nodes WHERE id IN ($1, $2)',
      [sourceId, targetId]
    );
    
    if (nodesResult.rows.length < 2) {
      throw new AppError('Source or target node not found', 404);
    }
    
    // Insert new edge
    const result = await query(
      'INSERT INTO knowledge_edges (source_id, target_id, relationship_type, weight) VALUES ($1, $2, $3, $4) RETURNING *',
      [sourceId, targetId, relationshipType, weight]
    );
    
    const newEdge = result.rows[0];
    
    // Return the new edge
    res.status(201).json({
      success: true,
      data: newEdge
    });
  } catch (error) {
    logger.error('Error adding knowledge edge:', error);
    throw new AppError('Failed to add knowledge edge', 500);
  }
}));

export const knowledgeGraphRoutes = router;