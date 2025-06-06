import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { query } from '../database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

/**
 * User registration
 * @route POST /api/auth/register
 */
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  
  // Validate request
  if (!username || !email || !password) {
    throw new AppError('Username, email, and password are required', 400);
  }
  
  // Check if user already exists
  const existingUser = await query(
    'SELECT * FROM users WHERE username = $1 OR email = $2',
    [username, email]
  );
  
  if (existingUser.rows.length > 0) {
    throw new AppError('Username or email already exists', 409);
  }
  
  // Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  // Create user
  const result = await query(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
    [username, email, passwordHash]
  );
  
  const user = result.rows[0];
  
  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.SESSION_SECRET || 'default-secret',
    { expiresIn: '24h' }
  );
  
  // Return user and token
  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      },
      token
    }
  });
}));

/**
 * User login
 * @route POST /api/auth/login
 */
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  // Validate request
  if (!username || !password) {
    throw new AppError('Username and password are required', 400);
  }
  
  // Find user
  const result = await query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  
  if (result.rows.length === 0) {
    throw new AppError('Invalid username or password', 401);
  }
  
  const user = result.rows[0];
  
  // Verify password
  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  
  if (!passwordMatch) {
    throw new AppError('Invalid username or password', 401);
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.SESSION_SECRET || 'default-secret',
    { expiresIn: '24h' }
  );
  
  // Return user and token
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      },
      token
    }
  });
}));

/**
 * Get current user
 * @route GET /api/auth/me
 * @middleware Authenticate
 */
router.get('/me', asyncHandler(async (req: Request, res: Response) => {
  // This would typically have authentication middleware to get the user from the token
  // For now, we'll assume the user ID is passed in the request
  const userId = req.headers['user-id'];
  
  if (!userId) {
    throw new AppError('Authentication required', 401);
  }
  
  // Find user
  const result = await query(
    'SELECT id, username, email, created_at FROM users WHERE id = $1',
    [userId]
  );
  
  if (result.rows.length === 0) {
    throw new AppError('User not found', 404);
  }
  
  const user = result.rows[0];
  
  // Return user
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      }
    }
  });
}));

export const authRoutes = router;