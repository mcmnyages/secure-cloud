// middleware/multer-error.middleware.ts

import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';
import { UPLOAD_CONFIG } from '../../constants/upload.constants.js';

export const multerErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (err instanceof multer.MulterError) {

    // 🔥 Handles exceeding MAX_COUNT in .array()
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {

      if (err.field === UPLOAD_CONFIG.BATCH_FIELD) {
        return res.status(400).json({
          status: 'fail',
          errorCode: 'LIMIT_EXCEEDED',
          message: `Maximum ${UPLOAD_CONFIG.MAX_COUNT} files allowed`
        });
      }

      return res.status(400).json({
        status: 'fail',
        errorCode: 'INVALID_FIELD',
        message: `Unexpected field name. Use '${UPLOAD_CONFIG.BATCH_FIELD}' for batch or '${UPLOAD_CONFIG.SINGLE_FIELD}' for single.`
      });
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'fail',
        errorCode: 'FILE_TOO_LARGE',
        message: 'File exceeds 100MB limit'
      });
    }
  }

  next(err);
};