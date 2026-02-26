import type { Request, Response } from 'express';
import { FileService } from './file.service.js';
import path from 'path';
import { asyncHandler } from '../../utils/asyncHandler.js';

const fileService = new FileService();

export class FileController {

  upload = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files as Express.Multer.File[];
    const replace = req.body.replace === 'true';

    const result = await fileService.uploadBatch(
      userId,
      files,
      replace
    );

    res.status(201).json({
      message: "Files uploaded successfully",
      ...result
    });
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const files = await fileService.listUserFiles(userId);

    const response = files.map(file => {
      const current = file.versions[file.versions.length - 1];

      return {
        id: file.id,
        name: current?.displayName || 'Unknown',
        size: current?.size,
        mimeType: current?.mimeType,
        createdAt: file.createdAt
      };
    });

    res.json(response);
  });

  rename = asyncHandler(async (req: Request, res: Response) => {
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
  });

  updateFile = asyncHandler(async (req: Request, res: Response) => {
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
  });

  download = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { fileId } = req.params;

    if (typeof fileId !== 'string') {
      return res.status(400).json({ message: "Invalid file id" });
    }

    const file = await fileService.getFileForUser(fileId, userId);

    const absolutePath = path.resolve(file.path);

    res.download(absolutePath, file.name);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { fileId } = req.params;

    if (typeof fileId !== 'string') {
      return res.status(400).json({ message: "Invalid file id" });
    }

    const result = await fileService.deleteFile(fileId, userId);

    res.status(200).json(result);
  });

  bulkDelete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { fileIds } = req.body;

    if (!Array.isArray(fileIds) || !fileIds.every(id => typeof id === 'string')) {
      return res.status(400).json({ message: "Invalid file ids" });
    }

    const result = await fileService.bulkDeleteFiles(fileIds, userId);

    res.status(200).json(result);
  });

}