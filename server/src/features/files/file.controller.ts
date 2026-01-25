import type { Request, Response } from 'express';
import { FileService } from './file.service.js';
import path from 'path';

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


  list = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const files = await fileService.listUserFiles(userId);
    res.json(files);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

download = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { fileId } = req.params;

    if (typeof fileId !== 'string') {
      return res.status(400).json({ message: "Invalid file id" });
    }

    const file = await fileService.getFileForUser(fileId, userId);

    // Resolve the absolute path to the file
    const absolutePath = path.resolve(file.path);
    
    // Express helper to send the file to the browser
    res.download(absolutePath, file.name); 
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

}