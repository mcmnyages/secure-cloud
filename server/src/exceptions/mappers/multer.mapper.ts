// src/exceptions/mappers/multer.mapper.ts
import multer from 'multer';

export const mapMulterError = (err: multer.MulterError) => {
  switch (err.code) {
    case 'LIMIT_FILE_SIZE':
      return { statusCode: 413, errorCode: 'FILE_TOO_LARGE', message: 'File size exceeds limit.' };
    case 'LIMIT_FILE_COUNT':
      return { statusCode: 400, errorCode: 'TOO_MANY_FILES', message: 'File count exceeds limit.' };
    case 'LIMIT_UNEXPECTED_FILE':
      return { statusCode: 400, errorCode: 'INVALID_FIELD', message: "Unexpected field name. Use 'files' for batch or 'file' for single." };
    default:
      return { statusCode: 400, errorCode: 'UPLOAD_ERROR', message: err.message };
  }
};