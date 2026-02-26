import { prisma } from '../../lib/prisma.js';
import fs from 'fs/promises';
import { StorageLimitExceededError, DuplicateFileError } from '../../exceptions/file/file.exceptions.js';

export class FileService {
  async uploadBatch(
  userId: string,
  files: Express.Multer.File[],
  replace: boolean
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const names = files.map(f => f.originalname);
  if (new Set(names).size !== names.length) {
    throw new DuplicateFileError("Duplicate file names in upload batch");
  }

  return prisma.$transaction(async (tx) => {

    let totalStorageIncrement = 0;
    const results = [];

    const existingFiles = await tx.file.findMany({
      where: {
        ownerId: userId,
        deletedAt: null,
        versions: {
          some: {
            isCurrent: true,
            displayName: { in: names }
          }
        }
      },
      include: { versions: true }
    });

    const existingMap = new Map(
      existingFiles.map(file => {
        const current = file.versions.find(v => v.isCurrent);
        return [current?.displayName, file];
      })
    );

    for (const file of files) {

      const existing = existingMap.get(file.originalname);

      // 🔁 Replace existing
      if (existing && replace) {

        const current = existing.versions.find(v => v.isCurrent);

        const latestVersion = await tx.fileVersion.findFirst({
          where: { fileId: existing.id },
          orderBy: { versionNumber: 'desc' }
        });

        const nextVersionNumber = (latestVersion?.versionNumber ?? 0) + 1;

        await tx.fileVersion.updateMany({
          where: { fileId: existing.id, isCurrent: true },
          data: { isCurrent: false }
        });

        const version = await tx.fileVersion.create({
          data: {
            fileId: existing.id,
            versionNumber: nextVersionNumber,
            storageKey: file.path,
            originalName: file.originalname,
            displayName: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
            isCurrent: true
          }
        });

        // storage difference logic
        const sizeDiff = file.size - (current?.size ?? 0);
        totalStorageIncrement += sizeDiff;

        results.push({ fileId: existing.id, version });
      }

      // ❌ Duplicate
      else if (existing && !replace) {
        throw new Error(`File "${file.originalname}" already exists`);
      }

      // 🆕 New file
      else {

        const newFile = await tx.file.create({
          data: { ownerId: userId }
        });

        const version = await tx.fileVersion.create({
          data: {
            fileId: newFile.id,
            versionNumber: 1,
            storageKey: file.path,
            originalName: file.originalname,
            displayName: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
            isCurrent: true
          }
        });

        totalStorageIncrement += file.size;

        results.push({ fileId: newFile.id, version });
      }
    }

    const newTotal = Number(user.storageUsed) + totalStorageIncrement;
    if (newTotal > Number(user.storageLimit)) {
      throw new StorageLimitExceededError();
    }

    await tx.user.update({
      where: { id: userId },
      data: { storageUsed: { increment: totalStorageIncrement } }
    });

    return {
      count: results.length,
      files: results.map(r => ({
        id: r.fileId,
        versionNumber: r.version.versionNumber,
        name: r.version.displayName,
        size: r.version.size,
        mimeType: r.version.mimeType,
        createdAt: r.version.createdAt
      }))
    };
  });
}


  async listUserFiles(userId: string) {
  return prisma.file.findMany({
    where: { ownerId: userId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      versions: {
        where: { isCurrent: true },
        select: {
          id: true,
          versionNumber: true,
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



  async findFileByName(userId: string, displayName: string) {
    return prisma.file.findFirst({
      where: {
        ownerId: userId,
        deletedAt: null,
        versions: {
          some: {
            isCurrent: true,
            displayName
          }
        }
      }
    });
  }


  async getFileVersions(fileId: string, userId: string) {
  return prisma.fileVersion.findMany({
    where: {
      fileId,
      file: { ownerId: userId, deletedAt: null }
    },
    orderBy: { versionNumber: 'desc' }
  });
}



  async renameFile(fileId: string, userId: string, newName: string) {
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

    return await prisma.fileVersion.update({
      where: { id: currentVersion.id },
      data: { displayName: newName }
    });
  }




  async uploadNewVersion(
  fileId: string,
  userId: string,
  storageKey: string,
  originalName: string,
  size: number,
  mimeType: string
) {
  return prisma.$transaction(async (tx) => {

    const file = await tx.file.findFirst({
      where: { id: fileId, ownerId: userId, deletedAt: null },
      include: { versions: true }
    });

    if (!file) throw new Error("File not found");

    const current = file.versions.find(v => v.isCurrent);

    const latestVersion = await tx.fileVersion.findFirst({
      where: { fileId },
      orderBy: { versionNumber: 'desc' }
    });

    const nextVersionNumber = (latestVersion?.versionNumber ?? 0) + 1;

    const sizeDiff = size - (current?.size ?? 0);

    const user = await tx.user.findUnique({ where: { id: userId } });
    const newTotal = Number(user!.storageUsed) + sizeDiff;

    if (newTotal > Number(user!.storageLimit)) {
      throw new StorageLimitExceededError();
    }

    await tx.fileVersion.updateMany({
      where: { fileId, isCurrent: true },
      data: { isCurrent: false }
    });

    const version = await tx.fileVersion.create({
      data: {
        fileId,
        versionNumber: nextVersionNumber,
        storageKey,
        originalName,
        displayName: originalName,
        size,
        mimeType,
        isCurrent: true
      }
    });

    await tx.user.update({
      where: { id: userId },
      data: { storageUsed: { increment: sizeDiff } }
    });

    return version;
  });
}


async getFileVersionForUser(fileId: string, versionId: string, userId: string) {
  const version = await prisma.fileVersion.findFirst({
    where: {
      id: versionId,
      fileId,
      file: {
        ownerId: userId,
        deletedAt: null
      }
    }
  });

  if (!version) {
    throw new Error("Version not found or access denied");
  }

  return version;
}

 async restoreVersion(fileId: string, versionId: string, userId: string) {
  return prisma.$transaction(async (tx) => {

    const version = await tx.fileVersion.findFirst({
      where: {
        id: versionId,
        fileId,
        file: {
          ownerId: userId,
          deletedAt: null
        }
      }
    });

    if (!version) {
      throw new Error("Version not found or access denied");
    }

    // Deactivate current
    await tx.fileVersion.updateMany({
      where: { fileId, isCurrent: true },
      data: { isCurrent: false }
    });

    // Activate selected
    await tx.fileVersion.update({
      where: { id: versionId },
      data: { isCurrent: true }
    });

    return { message: "Version restored successfully" };
  });
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