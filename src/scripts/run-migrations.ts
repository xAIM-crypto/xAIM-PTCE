import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: false // SSL disabled as per your configuration
};

// Override this setting for local development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function runMigrations() {
  console.log('Starting database migrations...');

  // Create a database connection
  const pool = new Pool(dbConfig);
  
  try {
    // Get migration files
    const migrationsDir = path.join(__dirname, '../../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure they run in order (001, 002, etc.)

    console.log(`Found ${migrationFiles.length} migration files`);
    
    // Run each migration file
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Execute the SQL commands
      await pool.query(sql);
      console.log(`Migration ${file} completed successfully`);
    }

    console.log('All migrations have been applied successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the migrations
runMigrations().catch(console.error); 