import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';

/**
 * Global error handling middleware
 * Formats errors consistently and handles different types of errors
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`Error: ${err.message}`);
  logger.error(err.stack);

  // If it's our custom AppError, use its status code
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
    return;
  }

  // Handle Prisma specific errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    // Handle unique constraint errors
    if (prismaError.code === 'P2002') {
      const field = prismaError.meta?.target?.[0] || 'field';
      res.status(409).json({
        status: 'error',
        message: `A record with this ${field} already exists.`
      });
      return;
    }
    
    // Handle foreign key constraint errors
    if (prismaError.code === 'P2003') {
      const field = prismaError.meta?.field_name || 'field';
      res.status(400).json({
        status: 'error',
        message: `Invalid reference in ${field}.`
      });
      return;
    }
    
    // Handle record not found errors
    if (prismaError.code === 'P2025') {
      res.status(404).json({
        status: 'error',
        message: prismaError.meta?.cause || 'Record not found.'
      });
      return;
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again.'
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      status: 'error',
      message: 'Your token has expired. Please log in again.'
    });
    return;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
    return;
  }

  // For unhandled errors, return a generic response in production
  // and more details in development
  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong'
    : err.message || 'Internal server error';

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};