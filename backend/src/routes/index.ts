import { Express } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import venueRoutes from './venue.routes';
import bookingRoutes from './booking.routes';
import communicationRoutes from './communication.routes';
import performanceRoutes from './performance.routes';
import bandRoutes from './band.routes';

/**
 * Sets up all API routes for the application
 * @param app Express application instance
 */
export const setupRoutes = (app: Express): void => {
  // API version prefix
  const apiPrefix = '/api/v1';
  
  // Health check endpoint
  app.get(`${apiPrefix}/health`, (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Apply all route groups
  app.use(`${apiPrefix}/auth`, authRoutes);
  app.use(`${apiPrefix}/users`, userRoutes);
  app.use(`${apiPrefix}/venues`, venueRoutes);
  app.use(`${apiPrefix}/bookings`, bookingRoutes);
  app.use(`${apiPrefix}/communications`, communicationRoutes);
  app.use(`${apiPrefix}/performances`, performanceRoutes);
  app.use(`${apiPrefix}/bands`, bandRoutes);
  
  // Fallback route for undefined routes
  app.use('*', (req, res) => {
    res.status(404).json({ 
      status: 'error', 
      message: `Cannot ${req.method} ${req.originalUrl}` 
    });
  });
};