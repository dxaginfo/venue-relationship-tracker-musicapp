import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to authenticate requests using JWT
 * Extracts the token from Authorization header, verifies it,
 * and attaches the user to the request object
 */
export const authenticate = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required. Please provide a valid token.'
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        role: true
      }
    });

    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.'
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      role: user.role
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      // Handle specific JWT errors
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          status: 'error',
          message: 'Your token has expired. Please log in again.'
        });
      } else {
        res.status(401).json({
          status: 'error',
          message: 'Invalid token. Please log in again.'
        });
      }
    } else {
      // Handle generic error
      res.status(500).json({
        status: 'error',
        message: 'An error occurred during authentication.'
      });
    }
  }
};

/**
 * Middleware to restrict access based on user roles
 * @param roles Array of roles allowed to access the route
 */
export const restrictTo = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to access this resource.'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action.'
      });
      return;
    }

    next();
  };
};