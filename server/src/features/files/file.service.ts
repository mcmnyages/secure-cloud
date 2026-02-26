import { prisma } from '../../lib/prisma.js';
import fs from 'fs/promises';
import { StorageLimitExceededError, DuplicateFileError } from '../../exceptions/file/file.exceptions.js';

export class FileService {
  async uploadBatch(
  userId: string,
  files: Express.Multer.File[],
  replace: boolean
) {
  // 1️⃣ Validate user
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) throw new Error("User not found");

  // 2️⃣ Check duplicate names inside batch
  const names = files.map(f => f.originalname);
  const uniqueNames = new Set(names);

  

  if (uniqueNames.size !== names.length) {
    throw new DuplicateFileError("Duplicate file names in upload batch");
  }

  // 3️⃣ Calculate total batch size
  const totalUploadSize = files.reduce((sum, f) => sum + f.size, 0);

  const newTotal = Number(user.storageUsed) + totalUploadSize;
  

  if (newTotal > Number(user.storageLimit)) {
    throw new StorageLimitExceededError();
  }

  // 4️⃣ Get existing files in one query
  const existingFiles = await prisma.file.findMany({
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
    include: {
      versions: true
    }
  });

  const existingMap = new Map(
    existingFiles.map(file => {
      const current = file.versions.find(v => v.isCurrent);
      return [current?.displayName, file];
    })
  );

  // 5️⃣ Transaction (ALL OR NOTHING)
  return await prisma.$transaction(async (tx) => {

    const results = [];

    for (const file of files) {

      const existing = existingMap.get(file.originalname);

      // 🔁 Replace existing
      if (existing && replace) {

        await tx.fileVersion.updateMany({
          where: { fileId: existing.id, isCurrent: true },
          data: { isCurrent: false }
        });

        const version = await tx.fileVersion.create({
          data: {
            fileId: existing.id,
            storageKey: file.path,
            originalName: file.originalname,
            displayName: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
            isCurrent: true
          }
        });

        results.push({
          fileId: existing.id,
          version
        });

      } 
      // ❌ Duplicate but replace = false
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
            storageKey: file.path,
            originalName: file.originalname,
            displayName: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
            isCurrent: true
          }
        });

        results.push({
          fileId: newFile.id,
          version
        });
      }
    }

    // 6️⃣ Update storage ONCE
    await tx.user.update({
      where: { id: userId },
      data: { storageUsed: { increment: totalUploadSize } }
    });

    return {
      count: results.length,
      files: results.map(r => ({
        id: r.fileId,
        name: r.version.displayName,
        size: r.version.size,
        mimeType: r.version.mimeType,
        createdAt: r.version.createdAt
      }))
    };
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

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const newTotal = Number(user.storageUsed) + size;
  if (newTotal > Number(user.storageLimit)) {
    throw new Error("Storage limit exceeded");
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Mark old version inactive
    await tx.fileVersion.updateMany({
      where: { fileId, isCurrent: true },
      data: { isCurrent: false }
    });

    // 2. Create new version
    const version = await tx.fileVersion.create({
      data: {
        fileId,
        storageKey,
        originalName,
        displayName: originalName,
        size,
        mimeType,
        isCurrent: true
      }
    });

    // 3. Update storage usage
    await tx.user.update({
      where: { id: userId },
      data: { storageUsed: { increment: size } }
    });

    return version;
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