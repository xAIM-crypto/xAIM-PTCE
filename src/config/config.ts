import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

// Create a new database pool
export const dbPool = new Pool(dbConfig);

// API keys
export const openAIConfig = {
  apiKey: process.env.OPEN_AI_API_KEY || '',
};

export const meshyConfig = {
  apiKey: process.env.MESHY_API_KEY || '',
};

// AWS Configuration
export const awsConfig = {
  accessKey: process.env.AWS_ACCESS_KEY,
  secretKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
};

// Server configuration
export const serverConfig = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Check for required configuration
export function validateConfig(): void {
  const missingVars = [];

  if (!openAIConfig.apiKey) missingVars.push('OPEN_AI_API_KEY');
  
  if (missingVars.length > 0) {
    console.warn(`Warning: Missing environment variables: ${missingVars.join(', ')}`);
  }
}

// Export default config object
export default {
  db: dbConfig,
  openAI: openAIConfig,
  meshy: meshyConfig,
  aws: awsConfig,
  server: serverConfig,
}; 