// src/exceptions/file.exceptions.ts
import { AppError } from '../base.exception.js';

export class StorageLimitExceededError extends AppError {
  constructor(message = "You have exceeded your storage limit.") {
    super(message, 403); // Forbidden
  }
}

export class FileNotFoundError extends AppError {
  constructor(message = "The requested file was not found.") {
    super(message, 404);
  }
}

export class DuplicateFileError extends AppError {
  constructor(fileName: string) {
    super(`File "${fileName}" already exists.`, 409); // Conflict
  }
}

export class BatchSizeExceededError extends AppError {
  constructor(limit: number) {
    super(`You can only upload a maximum of ${limit} files at once.`, 400);
  }
}