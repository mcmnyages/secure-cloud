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
    const current = file.versions[0]; // only 1 because filtered by isCurrent

    return {
      id: file.id,
      versionId: current?.id,
      versionNumber: current?.versionNumber,
      name: current?.displayName,
      size: current?.size,
      mimeType: current?.mimeType,
      createdAt: file.createdAt
    };
  });

  res.json(response);
});


 versions = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { fileId } = req.params;

  if (!fileId) {
    return res.status(400).json({ message: "Invalid file id" });
  }

  if (typeof fileId !== 'string') {
    return res.status(400).json({ message: "Invalid file id" });
  }

  const versions = await fileService.getFileVersions(fileId, userId);

  const response = versions.map(v => ({
    id: v.id,
    versionNumber: v.versionNumber,
    name: v.displayName,
    size: v.size,
    mimeType: v.mimeType,
    createdAt: v.createdAt,
    isCurrent: v.isCurrent
  }));

  res.json(response);
});


restoreVersion = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { fileId, versionId } = req.params;

  if (typeof fileId !== 'string' || typeof versionId !== 'string') {
    return res.status(400).json({ message: "Invalid file or version id" });
  }

  const result = await fileService.restoreVersion(
    fileId,
    versionId,
    userId
  );

  res.status(200).json(result);
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


  downloadVersion = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { fileId, versionId } = req.params;

  if (typeof fileId !== 'string' || typeof versionId !== 'string') {
    return res.status(400).json({ message: "Invalid file or version id" });
  }

  // Fetch the specific version for the user
  const version = await fileService.getFileVersionForUser(fileId, versionId, userId);

  // Resolve absolute path
  const absolutePath = path.resolve(version.storageKey);

  // Send the file to client
  res.download(absolutePath, version.displayName);
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