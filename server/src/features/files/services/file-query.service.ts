import { prisma } from '../../../lib/prisma.js';

export class FileQueryService {

  async listUserFiles(userId: string) {
    return prisma.file.findMany({
      where: {
        ownerId: userId,
        deletedAt: null
      },
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
            mimeType: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
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
      select: {
        versions: {
          where: { isCurrent: true },
          select: {
            storageKey: true,
            displayName: true
          }
        }
      }
    });

    if (!file) {
      throw new Error("File not found");
    }

    const current = file.versions[0];

    if (!current) {
      throw new Error("No current version found");
    }

    return {
      path: current.storageKey,
      name: current.displayName
    };
  }

  async getFileVersionForUser(
    fileId: string,
    versionId: string,
    userId: string
  ) {

    const version = await prisma.fileVersion.findFirst({
      where: {
        id: versionId,
        fileId,
        file: {
          ownerId: userId,
          deletedAt: null
        }
      },
      select: {
        id: true,
        versionNumber: true,
        displayName: true,
        storageKey: true,
        size: true,
        mimeType: true,
        createdAt: true,
        isCurrent: true
      }
    });

    if (!version) {
      throw new Error("Version not found");
    }

    return version;
  }

  async getFileVersions(fileId: string, userId: string) {

    const fileExists = await prisma.file.findFirst({
      where: {
        id: fileId,
        ownerId: userId,
        deletedAt: null
      },
      select: { id: true }
    });

    if (!fileExists) {
      throw new Error("File not found");
    }

    return prisma.fileVersion.findMany({
      where: {
        fileId
      },
      select: {
        id: true,
        versionNumber: true,
        displayName: true,
        size: true,
        mimeType: true,
        createdAt: true,
        isCurrent: true
      },
      orderBy: {
        versionNumber: 'desc'
      }
    });
  }

}