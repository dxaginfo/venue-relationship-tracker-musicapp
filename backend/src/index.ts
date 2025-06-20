import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';

import { setupRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { setupSwagger } from './utils/swagger';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 8000;

// Apply middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(limiter);

// Setup Swagger documentation
setupSwagger(app);

// Setup API routes
setupRoutes(app);

// Apply error handler middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
  logger.info(`API Documentation available at http://localhost:${port}/api-docs`);
});

export default app;