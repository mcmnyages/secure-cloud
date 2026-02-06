import { prisma } from '../../lib/prisma.js';
import fs from 'fs/promises';

export class FileService {
  async uploadFile(
  userId: string,
  originalName: string,
  storageKey: string,
  fileSize: number,
  mimeType: string,
  displayName?: string
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const newTotal = Number(user.storageUsed) + fileSize;
  if (newTotal > Number(user.storageLimit)) {
    throw new Error("Storage limit exceeded (100MB max)");
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Create logical File
    const file = await tx.file.create({
      data: { ownerId: userId }
    });

    // 2. Create FileVersion (actual blob)
    const version = await tx.fileVersion.create({
      data: {
        fileId: file.id,
        storageKey,
        size: fileSize,
        mimeType,
        originalName,
        displayName: displayName || originalName,
        isCurrent: true
      }
    });

    // 3. Update storage usage
    await tx.user.update({
      where: { id: userId },
      data: { storageUsed: { increment: fileSize } }
    });

    return { fileId: file.id, version };
  });
}


 async listUserFiles(userId: string) {
  return await prisma.file.findMany({
    where: {
      ownerId: userId,
      deletedAt: null
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      versions: {
        where: { isCurrent: true },
        select: {
          displayName: true,
          size: true,
          mimeType: true,
          createdAt: true
        }
      }
    }
  });
}


async getFileForUser(fileId: string, userId: string) {
  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      ownerId: userId,
      deletedAt: null
    },
    include: {
      versions: true
    }
  });

  if (!file) {
    throw new Error("File not found or access denied");
  }

  const currentVersion = file.versions.find(v => v.isCurrent);

  if (!currentVersion) {
    throw new Error("No active file version found");
  }

  return {
    path: currentVersion.storageKey,
    name: currentVersion.displayName
  };
}


async deleteFile(fileId: string, userId: string) {
  const file = await prisma.file.findFirst({
    where: { id: fileId, ownerId: userId },
    include: { versions: true }
  });

  if (!file) throw new Error("File not found or access denied");

  return await prisma.$transaction(async (tx) => {
    // 1. Soft delete logical file
    await tx.file.update({
      where: { id: fileId },
      data: { deletedAt: new Date() }
    });

    // 2. Update storage
    const totalSize = file.versions.reduce((a, v) => a + v.size, 0);
    await tx.user.update({
      where: { id: userId },
      data: { storageUsed: { decrement: totalSize } }
    });

    // 3. Delete physical blobs
    for (const v of file.versions) {
      await fs.unlink(v.storageKey);
    }

    return { message: "File deleted successfully" };
  });
}


// bulk delete files
async bulkDeleteFiles(fileIds: string[], userId: string) {
  const files = await prisma.file.findMany({
    where: {
      id: { in: fileIds },
      ownerId: userId,
      deletedAt: null
    },
    include: {
      versions: true
    }
  });

  if (files.length === 0) {
    throw new Error("No files found or access denied");
  }

  return await prisma.$transaction(async (tx) => {
    let totalSize = 0;

    for (const file of files) {
      for (const version of file.versions) {
        totalSize += version.size;
        await fs.unlink(version.storageKey);
      }

      await tx.file.update({
        where: { id: file.id },
        data: { deletedAt: new Date() }
      });
    }

    await tx.user.update({
      where: { id: userId },
      data: { storageUsed: { decrement: totalSize } }
    });

    return { message: "Files deleted successfully" };
  });
}
}