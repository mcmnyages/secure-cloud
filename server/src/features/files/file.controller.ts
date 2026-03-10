import type { Request, Response } from 'express';
import { FileService } from './file.service.js';
import path from 'path';
import { asyncHandler } from '../../utils/asyncHandler.js';

const fileService = new FileService();

export class FileController {

  upload = asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const files = req.files as Express.Multer.File[];
      const replace = req.body.replace === 'true';

      const result = await fileService.uploadBatch(userId, files, replace);

      res.status(201).json({
        message: "Files uploaded successfully",
        ...result
      });

    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;

      const files = await fileService.listUserFiles(userId);

      const response = files.map(file => {
        if (!file.versions || file.versions.length === 0) {
          return {
            id: file.id,
            versionId: null,
            versionNumber: null,
            name: null,
            size: null,
            mimeType: null,
            createdAt: file.createdAt
          };
        }

        const current = file.versions[0];

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

    } catch (error) {
      console.error("Error listing user files:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  versions = asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { fileId } = req.params;

      if (!fileId || typeof fileId !== 'string') {
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

    } catch (error) {
      console.error("Error fetching versions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  restoreVersion = asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { fileId, versionId } = req.params;

      if (typeof fileId !== 'string' || typeof versionId !== 'string') {
        return res.status(400).json({ message: "Invalid file or version id" });
      }

      const result = await fileService.restoreVersion(fileId, versionId, userId);

      res.status(200).json(result);

    } catch (error) {
      console.error("Error restoring version:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  rename = asyncHandler(async (req: Request, res: Response) => {
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

    } catch (error) {
      console.error("Rename error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  updateFile = asyncHandler(async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = (req as any).userId;
      const { fileId } = req.params;

      if (typeof fileId !== 'string') {
        return res.status(400).json({ message: "Invalid file id" });
      }

      await fileService.uploadNewVersion(fileId, userId, req.file);

      res.json({ message: "File updated successfully" });

    } catch (error) {
      console.error("Update file error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  download = asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { fileId } = req.params;

      if (typeof fileId !== 'string') {
        return res.status(400).json({ message: "Invalid file id" });
      }

      const file = await fileService.getFileForUser(fileId, userId);

      const absolutePath = path.resolve(file.path);

      res.download(absolutePath, file.name);

    } catch (error) {
      console.error("Download error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  downloadVersion = asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { fileId, versionId } = req.params;

      if (typeof fileId !== 'string' || typeof versionId !== 'string') {
        return res.status(400).json({ message: "Invalid file or version id" });
      }

      const version = await fileService.getFileVersionForUser(fileId, versionId, userId);

      const absolutePath = path.resolve(version.storageKey);

      res.download(absolutePath, version.displayName);

    } catch (error) {
      console.error("Download version error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { fileId } = req.params;

    if (typeof fileId !== 'string') {
      return res.status(400).json({ message: "Invalid file id" });
    }

    try {
      const result = await fileService.deleteFile(fileId, userId);
      if ('notFound' in result && result.notFound) {
        return res.status(404).json({ message: "File not found or already deleted" });
      }
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "File not found") {
        return res.status(404).json({ message: "File not found" });
      }
      console.error("Delete file error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  bulkDelete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { fileIds } = req.body;

    if (!Array.isArray(fileIds) || !fileIds.every(id => typeof id === 'string')) {
      return res.status(400).json({ message: "Invalid file ids" });
    }

    try {
      const result = await fileService.bulkDeleteFiles(fileIds, userId);
      if ('notFound' in result && result.notFound) {
        return res.status(404).json({ message: "No files found or already deleted" });
      }
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "No files found") {
        return res.status(404).json({ message: "No files found" });
      }
      console.error("Bulk delete error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

}