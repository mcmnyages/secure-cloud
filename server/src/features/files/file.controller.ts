import type { Request, Response } from 'express';
import { FileService } from './file.service.js';
import path from 'path';

const fileService = new FileService();

export class FileController {
  upload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = (req as any).userId;

    const result = await fileService.uploadFile(
      userId,
      req.file.originalname,
      req.file.path,        // now = storageKey
      req.file.size,
      req.file.mimetype,
      req.body.displayName // optional
    );

  res.status(201).json({
  message: "File uploaded successfully",
  file: {
    id: result.fileId,
    name: result.version.displayName || result.version.originalName,
    size: result.version.size,
    mimeType: result.version.mimeType,
    createdAt: result.version.createdAt
  }
});
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

  list = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const files = await fileService.listUserFiles(userId);
    const response = files.map(file => {
  // Assume the latest version is the current one (e.g., last in array)
  const current = file.versions[file.versions.length - 1];
  return {
    id: file.id,
    name: current?.displayName || current?.displayName || 'Unknown',
    size: current?.size,
    mimeType: current?.mimeType,
    createdAt: file.createdAt
  };
});
res.json(response);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



rename = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { fileId } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: "Invalid name" });
    }

    if (typeof fileId !== 'string') {
      return res.status(400).json({ message: "Invalid file id" });
    }

    await fileService.renameFile(fileId, userId, name);

    res.json({ message: "File renamed successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};



updateFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = (req as any).userId;
    const { fileId } = req.params;
    
    if (typeof fileId !== 'string') {
      return res.status(400).json({ message: "Invalid file id" });
    }

    await fileService.uploadNewVersion(
      fileId,
      userId,
      req.file.path,
      req.file.originalname,
      req.file.size,
      req.file.mimetype
    );

    res.json({ message: "File updated successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
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

delete = async (req: Request, res: Response, next: Function) => {
  try {
    const userId = (req as any).userId;
    const { fileId } = req.params;

    if (typeof fileId !== 'string') {
      return res.status(400).json({ message: "Invalid file id" });
    }

    const result = await fileService.deleteFile(fileId, userId);
    
    res.status(200).json(result);
  } catch (error: any) {
    // We pass the error to the next() function to use our Global Error Handler
    next(error); 
  }
};
// delete multiple files
bulkDelete = async (req: Request, res: Response, next: Function) => {
  try {
    const userId = (req as any).userId;
    const { fileIds } = req.body; 
    if (!Array.isArray(fileIds) || !fileIds.every(id => typeof id === 'string')) {
      return res.status(400).json({ message: "Invalid file ids" });
    }

    const result = await fileService.bulkDeleteFiles(fileIds, userId);
    
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  } 
};

}