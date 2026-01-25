import type { Request, Response } from 'express';
import { FileService } from './file.service.js';

const fileService = new FileService();

export class FileController {
  upload = async (req: Request, res: Response) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const userId = (req as any).userId; // Injected by our authenticate middleware
      
      const file = await fileService.uploadFile(
        userId,
        req.file.originalname,
        req.file.path,
        req.file.size
      );

      res.status(201).json({ message: "File uploaded successfully", file });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}