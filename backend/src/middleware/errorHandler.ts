import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../utils/ownershipCheck';
import logger from '../config/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Handle NotFoundError
  if (err instanceof NotFoundError || err.name === 'NotFoundError') {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: err.message || 'Resource not found' },
    });
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId format) -> clean 404
  if (err.name === 'CastError') {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Resource not found' },
    });
    return;
  }

  // Handle JSON SyntaxError in request body
  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    res.status(400).json({
      success: false,
      error: { code: 'BAD_REQUEST', message: 'Malformed JSON payload' },
    });
    return;
  }

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    res.status(409).json({
      success: false,
      error: { code: 'CONFLICT', message: 'Resource already exists' },
    });
    return;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: err.message },
    });
    return;
  }

  // Handle JWT Token Errors
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: { code: 'TOKEN_EXPIRED', message: 'Token has expired' },
    });
    return;
  }
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: { code: 'TOKEN_INVALID', message: 'Invalid token' },
    });
    return;
  }

  // Handle explicit custom status codes (e.g. Object.assign(new Error(), { statusCode: 400, code: '...' }))
  if (err.statusCode && typeof err.statusCode === 'number') {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || 'ERROR',
        message: err.message || 'An error occurred',
      },
    });
    return;
  }

  // Fallback for unexpected server exceptions
  logger.error('Unhandled Error:', err);
  
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: isProduction ? 'An unexpected error occurred' : err.message,
    },
  });
};
