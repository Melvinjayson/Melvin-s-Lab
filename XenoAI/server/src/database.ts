import { Pool } from 'pg';
import { logger } from './utils/logger';

// Create a new PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Initialize the database connection and create necessary tables
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Test the connection
    const client = await pool.connect();
    logger.info('Connected to PostgreSQL database');
    
    // Create tables if they don't exist
    await createTables(client);
    
    // Release the client back to the pool
    client.release();
    
    return Promise.resolve();
  } catch (error) {
    logger.error('Database initialization error:', error);
    return Promise.reject(error);
  }
};

/**
 * Create necessary database tables if they don't exist
 */
const createTables = async (client: any): Promise<void> => {
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create conversations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        is_user BOOLEAN NOT NULL,
        agent_role VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create knowledge_nodes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS knowledge_nodes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create knowledge_edges table
    await client.query(`
      CREATE TABLE IF NOT EXISTS knowledge_edges (
        id SERIAL PRIMARY KEY,
        source_id INTEGER REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
        target_id INTEGER REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
        relationship_type VARCHAR(100),
        weight FLOAT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(source_id, target_id)
      );
    `);
    
    logger.info('Database tables created successfully');
  } catch (error) {
    logger.error('Error creating database tables:', error);
    throw error;
  }
};

/**
 * Execute a query on the database
 */
export const query = (text: string, params: any[] = []): Promise<any> => {
  return pool.query(text, params);
};

/**
 * Get a client from the pool
 */
export const getClient = (): Promise<any> => {
  return pool.connect();
};

/**
 * Close the database connection pool
 */
export const closePool = async (): Promise<void> => {
  await pool.end();
};