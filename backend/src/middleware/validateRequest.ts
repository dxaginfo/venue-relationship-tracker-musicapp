import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '../utils/logger';

/**
 * Middleware to validate request data using Joi schemas
 * @param schema Joi validation schema
 */
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Include all errors
      allowUnknown: true, // Ignore unknown props
      stripUnknown: true // Remove unknown props
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }));
      
      logger.debug(`Validation error: ${JSON.stringify(errorDetails)}`);
      
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: errorDetails
      });
    }

    next();
  };
};