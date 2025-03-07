// Main application file for the PTCE implementation
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Import configuration
import { serverConfig, validateConfig } from './config/config';

// Import routes
import ptceRoutes from './routes/ptce-routes';
// Import other existing routes...

// Load environment variables
dotenv.config();

// Validate required configuration
validateConfig();

// Initialize express app
const app = express();
const PORT = serverConfig.port;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/ptce', ptceRoutes);
// Register other existing routes...

// Basic health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', environment: serverConfig.nodeEnv });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${serverConfig.nodeEnv} mode on port ${PORT}`);
  console.log(`PTCE API available at http://localhost:${PORT}/api/ptce`);
  console.log('Press CTRL+C to stop the server');
}); 