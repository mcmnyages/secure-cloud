// src/middleware/error.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../exceptions/base.exception.js';
import multer from 'multer';
import { mapMulterError } from '../exceptions/mappers/multer.mapper.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.constructor.name;

  // Handle Multer specific errors
  if (err instanceof multer.MulterError) {
    const mapped = mapMulterError(err);
    statusCode = mapped.statusCode;
    message = mapped.message;
    errorCode = mapped.errorCode;
  } 
  // Handle our custom AppErrors
  else if (err instanceof AppError) {
  statusCode = err.statusCode;
  message = err.message;
  errorCode = err.errorCode;
}

  res.status(statusCode).json({
    status: statusCode < 500 ? 'fail' : 'error',
    errorCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};