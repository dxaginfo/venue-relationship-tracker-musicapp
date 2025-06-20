import { Express } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Venue Relationship Tracker API',
      version: '1.0.0',
      description: 'API for the Venue Relationship Tracker application',
      contact: {
        name: 'API Support',
        email: 'dxag.info@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://api.venue-tracker.example.com/api/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Venues',
        description: 'Venue management endpoints'
      },
      {
        name: 'Bookings',
        description: 'Booking management endpoints'
      },
      {
        name: 'Communications',
        description: 'Communication tracking endpoints'
      },
      {
        name: 'Performances',
        description: 'Performance tracking endpoints'
      },
      {
        name: 'Bands',
        description: 'Band management endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsDoc(options);

/**
 * Sets up Swagger documentation
 * @param app Express application
 */
export const setupSwagger = (app: Express): void => {
  // Serve Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }', // Hide Swagger UI top bar
    customSiteTitle: 'Venue Relationship Tracker API Documentation'
  }));
  
  // Serve Swagger JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};